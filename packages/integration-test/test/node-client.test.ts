import { Request, RequestNetwork } from '@requestnetwork/client-side';
import { EthereumPrivateKeySignatureProvider } from '@requestnetwork/ethereum-private-key-signature-provider';
import {
  Identity as IdentityTypes,
  RequestLogic as RequestLogicTypes,
  Signature as SignatureTypes,
} from '@requestnetwork/types';

import { assert } from 'chai';
import 'mocha';

const payeeIdentity: IdentityTypes.IIdentity = {
  type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
  value: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
};
const payerIdentity: IdentityTypes.IIdentity = {
  type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
  value: '0x740fc87Bd3f41d07d23A01DEc90623eBC5fed9D6',
};

const requestCreationHash: RequestLogicTypes.IRequestLogicCreateParameters = {
  currency: RequestLogicTypes.REQUEST_LOGIC_CURRENCY.ETH,
  expectedAmount: '100000000000',
  payee: payeeIdentity,
  payer: payerIdentity,
};

const topics = [payerIdentity.value, payeeIdentity.value];

const signatureProvider = new EthereumPrivateKeySignatureProvider({
  method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
  privateKey: '0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3',
});

describe('Request client using a request node', () => {
  it('can create a request, change the amount and get data', async () => {
    const requestNetwork = new RequestNetwork({ signatureProvider });

    // Create a request
    const { request } = await requestNetwork.createRequest(
      requestCreationHash,
      payeeIdentity,
      topics,
    );
    assert.instanceOf(request, Request);
    assert.exists(request.requestId);

    // Get the data
    const { result: result1 } = await request.getData();
    assert.equal(result1.request.expectedAmount, '100000000000');

    // Reduce the amount and get the data
    await request.reduceExpectedAmountRequest('20000000000', payeeIdentity);
    const { result: result2 } = await request.getData();
    assert.equal(result2.request.expectedAmount, '80000000000');
  });
});