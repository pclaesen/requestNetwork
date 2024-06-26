import {
  AdvancedLogicTypes,
  ExtensionTypes,
  IdentityTypes,
  PaymentTypes,
  RequestLogicTypes,
} from '@requestnetwork/types';

import { DeclarativePaymentDetector } from '../src/declarative';
import { mockAdvancedLogicBase } from './utils';

let declarative: DeclarativePaymentDetector;

const mockAdvancedLogic: AdvancedLogicTypes.IAdvancedLogic = {
  ...mockAdvancedLogicBase,
  extensions: {
    declarative: {
      createAddPaymentInstructionAction(): any {
        return;
      },
      createAddRefundInstructionAction(): any {
        return;
      },
      createCreationAction(): any {
        return;
      },
      createDeclareReceivedPaymentAction(): any {
        return;
      },
      createDeclareReceivedRefundAction(): any {
        return;
      },
      createDeclareSentPaymentAction(): any {
        return;
      },
      createDeclareSentRefundAction(): any {
        return;
      },
    },
  } as any as AdvancedLogicTypes.IAdvancedLogicExtensions,
};

const requestMock: RequestLogicTypes.IRequest = {
  creator: {
    type: IdentityTypes.TYPE.ETHEREUM_ADDRESS,
    value: '',
  },
  currency: {
    type: RequestLogicTypes.CURRENCY.ETH,
    value: 'ETH',
  },
  events: [],
  expectedAmount: '',
  extensions: {},
  extensionsData: [],
  requestId: '',
  state: RequestLogicTypes.STATE.CREATED,
  timestamp: 0,
  version: '',
};

// Most of the tests are done as integration tests in ../index.test.ts
/* eslint-disable @typescript-eslint/no-unused-expressions */
describe('api/declarative', () => {
  beforeEach(() => {
    declarative = new DeclarativePaymentDetector({ advancedLogic: mockAdvancedLogic });
  });

  it('can createExtensionsDataForCreation', async () => {
    const spy = jest.spyOn(mockAdvancedLogic.extensions.declarative, 'createCreationAction');

    await declarative.createExtensionsDataForCreation({
      paymentInfo: 'payment instruction',
      refundInfo: 'refund instruction',
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForAddPaymentInformation', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createAddPaymentInstructionAction',
    );

    declarative.createExtensionsDataForAddPaymentInformation({
      paymentInfo: 'payment instruction',
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForAddRefundInformation', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createAddRefundInstructionAction',
    );

    declarative.createExtensionsDataForAddRefundInformation({ refundInfo: 'refund instruction' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForDeclareSentPayment', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createDeclareSentPaymentAction',
    );

    declarative.createExtensionsDataForDeclareSentPayment({ amount: '1000', note: 'payment sent' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForDeclareSentRefund', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createDeclareSentRefundAction',
    );

    declarative.createExtensionsDataForDeclareSentRefund({ amount: '1000', note: 'refund sent' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForDeclareReceivedPayment', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createDeclareReceivedPaymentAction',
    );

    declarative.createExtensionsDataForDeclareReceivedPayment({
      amount: '1000',
      note: 'payment received',
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('can createExtensionsDataForDeclareReceivedRefund', async () => {
    const spy = jest.spyOn(
      mockAdvancedLogic.extensions.declarative,
      'createDeclareReceivedRefundAction',
    );

    declarative.createExtensionsDataForDeclareReceivedRefund({
      amount: '1000',
      note: 'refund received',
    });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('getBalance get the correct balance', async () => {
    requestMock.extensions[ExtensionTypes.PAYMENT_NETWORK_ID.ANY_DECLARATIVE] = {
      events: [
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_SENT_PAYMENT,
          parameters: {},
          timestamp: 10,
        },
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_SENT_REFUND,
          parameters: {},
          timestamp: 10,
        },
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_PAYMENT,
          parameters: {
            amount: '1000',
            note: 'first payment',
            txHash: 'the-first-hash',
            network: 'mainnet',
          },
          timestamp: 10,
        },
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_PAYMENT,
          parameters: {
            amount: '500',
            note: 'second payment',
            txHash: 'the-second-hash',
            network: 'matic',
          },
          timestamp: 15,
        },
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_REFUND,
          parameters: {
            amount: '100',
            note: 'first refund',
            txHash: 'the-first-refund-hash',
            network: 'mainnet',
          },
          timestamp: 20,
        },
        {
          name: ExtensionTypes.PnAnyDeclarative.ACTION.DECLARE_RECEIVED_REFUND,
          parameters: {
            amount: '200',
            note: 'second refund',
            txHash: 'the-second-refund-hash',
            network: 'matic',
          },
          timestamp: 25,
        },
      ],
    } as ExtensionTypes.IState;

    const getBalanceReturn = await declarative.getBalance(requestMock);

    expect(getBalanceReturn).toMatchObject({
      balance: '1200', // 1000 + 500 - 100 - 200
      events: [
        {
          amount: '1000',
          name: PaymentTypes.EVENTS_NAMES.PAYMENT,
          parameters: {
            note: 'first payment',
            txHash: 'the-first-hash',
            network: 'mainnet',
          },
          timestamp: 10,
        },
        {
          amount: '500',
          name: PaymentTypes.EVENTS_NAMES.PAYMENT,
          parameters: {
            note: 'second payment',
            txHash: 'the-second-hash',
            network: 'matic',
          },
          timestamp: 15,
        },
        {
          amount: '100',
          name: PaymentTypes.EVENTS_NAMES.REFUND,
          parameters: {
            note: 'first refund',
            txHash: 'the-first-refund-hash',
            network: 'mainnet',
          },
          timestamp: 20,
        },
        {
          amount: '200',
          name: PaymentTypes.EVENTS_NAMES.REFUND,
          parameters: {
            note: 'second refund',
            txHash: 'the-second-refund-hash',
            network: 'matic',
          },
          timestamp: 25,
        },
      ],
    });
  });
});
