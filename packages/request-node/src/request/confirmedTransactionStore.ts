import { DataAccessTypes } from '@requestnetwork/types';
import Keyv, { Store } from 'keyv';

/**
 * Class for storing confirmed transactions information
 * When 'confirmed' event is received from a 'persistTransaction', the event data are stored.
 * The client can call the getConfirmed entry point, to get the confirmed event.
 */
export default class ConfirmedTransactionStore {
  private store: Keyv<DataAccessTypes.IReturnPersistTransactionRaw | Error>;

  /**
   * Confirmed transactions store constructor
   */
  constructor(store?: Store<DataAccessTypes.IReturnPersistTransaction | Error>) {
    this.store = new Keyv<DataAccessTypes.IReturnPersistTransaction | Error>({
      namespace: 'ConfirmedTransactions',
      store,
    });
  }

  public async getConfirmedTransaction(
    transactionHash: string,
  ): Promise<DataAccessTypes.IReturnPersistTransactionRaw | Error | undefined> {
    return this.store.get(transactionHash);
  }

  /**
   * Stores the result of a transaction confirmation
   *
   * @param transactionHash hash of the transaction
   * @param result result of the event "confirmed"
   */
  public async addConfirmedTransaction(
    transactionHash: string,
    result: DataAccessTypes.IReturnPersistTransactionRaw,
  ): Promise<void> {
    await this.store.set(transactionHash, result);
  }

  /**
   * Stores the error
   *
   * @param transactionHash hash of the transaction
   * @param error error of the event "error"
   */
  public async addFailedTransaction(transactionHash: string, error: Error): Promise<void> {
    await this.store.set(transactionHash, error);
  }
}
