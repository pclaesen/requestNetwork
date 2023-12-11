import { BigNumber, ContractTransaction, providers, Signer, utils } from 'ethers';
import { CurrencyTypes, LogTypes, StorageTypes } from '@requestnetwork/types';
import { requestHashSubmitterArtifact } from '@requestnetwork/smart-contracts';
import { RequestOpenHashSubmitter } from '@requestnetwork/smart-contracts/types';
import { GasFeeDefiner } from './gas-fee-definer';
import { SimpleLogger, isEip1559Supported } from '@requestnetwork/utils';

export type SubmitterProps = {
  signer: Signer;
  gasPriceMin?: BigNumber;
  network: CurrencyTypes.EvmChainName;
  logger?: LogTypes.ILogger;
  debugProvider?: boolean;
};

/**
 * Handles the submission of a hash on the request HashSubmitter contract
 */
export class EthereumTransactionSubmitter implements StorageTypes.ITransactionSubmitter {
  private readonly logger: LogTypes.ILogger;
  private enableEip1559 = true;
  private readonly hashSubmitter: RequestOpenHashSubmitter;
  private readonly provider: providers.JsonRpcProvider;
  private readonly gasFeeDefiner: GasFeeDefiner;

  constructor({ network, signer, logger, gasPriceMin, debugProvider }: SubmitterProps) {
    this.logger = logger || new SimpleLogger();
    const provider = signer.provider as providers.JsonRpcProvider;
    this.provider = provider;
    this.hashSubmitter = requestHashSubmitterArtifact.connect(
      network,
      signer,
    ) as RequestOpenHashSubmitter; // type mismatch with ethers.
    this.gasFeeDefiner = new GasFeeDefiner({ provider, gasPriceMin, logger: this.logger });
    if (debugProvider) {
      this.provider.on('debug', (event) => {
        this.logger.debug('JsonRpcProvider debug event', event);
      });
    }
  }

  get hashSubmitterAddress(): string {
    return this.hashSubmitter.address;
  }

  async initialize(): Promise<void> {
    this.enableEip1559 = await isEip1559Supported(this.provider, this.logger);
  }

  /** Submits an IPFS hash, with fees according to `ipfsSize`  */
  async submit(ipfsHash: string, ipfsSize: number): Promise<ContractTransaction> {
    const preparedTransaction = await this.prepareSubmit(ipfsHash, ipfsSize);
    return await this.hashSubmitter.signer.sendTransaction(preparedTransaction);
  }

  /** Encodes the submission of an IPFS hash, with fees according to `ipfsSize` */
  async prepareSubmit(ipfsHash: string, ipfsSize: number): Promise<providers.TransactionRequest> {
    const fee = await this.hashSubmitter.getFeesAmount(ipfsSize);
    const gasFees = this.enableEip1559 ? await this.gasFeeDefiner.getGasFees() : {};

    const tx = this.hashSubmitter.interface.encodeFunctionData('submitHash', [
      ipfsHash,
      utils.hexZeroPad(utils.hexlify(ipfsSize), 32),
    ]);

    return { to: this.hashSubmitter.address, data: tx, value: fee, ...gasFees };
  }
}
