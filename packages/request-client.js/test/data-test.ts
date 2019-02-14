import {
  Identity as IdentityTypes,
  RequestLogic as RequestLogicTypes,
  Signature as SignatureTypes,
} from '@requestnetwork/types';

export const parameters: RequestLogicTypes.IRequestLogicCreateParameters = {
  currency: RequestLogicTypes.REQUEST_LOGIC_CURRENCY.BTC,
  expectedAmount: '100000000000',
  extensionsData: [
    {
      action: 'create',
      id: 'pn-testnet-bitcoin-address-based',
      parameters: {
        paymentAddress: 'mgPKDuVmuS9oeE2D9VPiCQriyU14wxWS1v',
      },
      version: '0.1.0',
    },
  ],
  payee: {
    type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
    value: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
  },
  payer: {
    type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
    value: '0x740fc87Bd3f41d07d23A01DEc90623eBC5fed9D6',
  },
  timestamp: 1549953337,
};

export const data = {
  name: RequestLogicTypes.REQUEST_LOGIC_ACTION_NAME.CREATE,
  parameters,
  version: '0.1.0',
};

export const signature: SignatureTypes.ISignature = {
  method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
  value:
    '0x5bf14cb6c310a48b268c42c9c67deda6edbe57c5eb0a0e1d7fbed1faef8a3b082a3e064efb3f8097fa292e6554b71e811e0df49c70434959c60a36173dd795841b',
};
export const action: RequestLogicTypes.IRequestLogicAction = {
  data,
  signature,
};