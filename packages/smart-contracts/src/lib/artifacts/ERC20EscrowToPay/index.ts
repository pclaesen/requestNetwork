import { ContractArtifact } from '../../ContractArtifact';

import { abi as ABI_0_1_0 } from './0.1.0.json';
import type { ERC20EscrowToPay } from 'smart-contracts/src/types/';


export const erc20EscrowToPayArtifact = new ContractArtifact<ERC20EscrowToPay>(
    {
        '0.1.0': {
            abi: ABI_0_1_0,
            deployment: {
                private: {
                    address: '0x3b863735261925EB860C7F2729e07612ff8326e8',
                    creationBlockNumber: 0,
                },
                mainnet: {
                    address: 'TODO',
                    creationBlockNumber: 10774767,
                },
                rinkeby: {
                    address: 'TODO',
                    creationBlockNumber: 7118080,
                },
            },
        },
    },
    '0.1.0',
);