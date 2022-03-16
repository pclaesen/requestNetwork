import { ContractArtifact } from '../..';
import { ERC20Alpha, TestERC20 } from '../../src/types';

export const localERC20AlphaArtifact = new ContractArtifact<ERC20Alpha>(
  {
    '0.0.1': {
      abi: [],
      deployment: {
        private: {
          address: '0x38cF23C52Bb4B13F051Aec09580a2dE845a7FA35',
          creationBlockNumber: 0,
        },
      },
    },
  },
  '0.0.1',
);

export const localUSDTArtifact = new ContractArtifact<ERC20Alpha>(
  {
    '0.0.1': {
      abi: [],
      deployment: {
        private: {
          address: '0x4e71920b7330515faf5EA0c690f1aD06a85fB60c',
          creationBlockNumber: 0,
        },
      },
    },
  },
  '0.0.1',
);

export const localTestErc20 = new ContractArtifact<TestERC20>(
  {
    '0.0.1': {
      abi: [],
      deployment: {
        private: {
          address: '0x9FBDa871d559710256a2502A2517b794B482Db40',
          creationBlockNumber: 0,
        },
      },
    },
  },
  '0.0.1',
);
