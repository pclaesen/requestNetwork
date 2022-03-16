import { ContractArtifact } from '../../ContractArtifact';

import { abi as ABI_0_1_0 } from './0.1.0.json';
import { abi as ABI_0_1_1 } from './0.1.1.json';
// @ts-ignore Cannot find module
import type { Erc20ConversionProxy } from '../../../types/Erc20ConversionProxy';

export const erc20ConversionProxy = new ContractArtifact<Erc20ConversionProxy>(
  {
    '0.1.0': {
      abi: ABI_0_1_0,
      deployment: {
        private: {
          address: '0xd54b47F8e6A1b97F3A84f63c867286272b273b7C',
          creationBlockNumber: 0,
        },
        mainnet: {
          address: '0xe72Ecea44b6d8B2b3cf5171214D9730E86213cA2',
          creationBlockNumber: 12225751,
        },
        rinkeby: {
          address: '0xda46309973bFfDdD5a10cE12c44d2EE266f45A44',
          creationBlockNumber: 7118080,
        },
        matic: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 17427747,
        },
        xdai: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 18326898,
        },
        bsctest: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 12759699,
        },
        bsc: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 11540180,
        },
        fantom: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 20061367,
        },
        celo: {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 10141033,
        },
        'arbitrum-rinkeby': {
          address: '0xf0f49873C50765239F6f9534Ba13c4fe16eD5f2E',
          creationBlockNumber: 8403930,
        },
        /**
         * FIXME: The contract was deployed on networks below with ABI 0.1.1
         * The ABI for payments is the same, only administration tasks change.
         *  */
        'arbitrum-one': {
          address: '0xA5186dec7dC1ec85B42A3cd2Dc8289e248530B07',
          creationBlockNumber: 5321045,
        },
        avalanche: {
          address: '0xA5186dec7dC1ec85B42A3cd2Dc8289e248530B07',
          creationBlockNumber: 11671967,
        },
      },
    },
    '0.1.1': {
      abi: ABI_0_1_1,
      deployment: {
        private: {
          address: '0xd54b47F8e6A1b97F3A84f63c867286272b273b7C',
          creationBlockNumber: 0,
        },
      },
    },
  },
  '0.1.0',
);
