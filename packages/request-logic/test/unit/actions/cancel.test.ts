import { expect } from 'chai';
import 'mocha';

import {
  Identity as IdentityTypes,
  RequestLogic as Types,
  Signature as SignatureTypes,
} from '@requestnetwork/types';
import Utils from '@requestnetwork/utils';
import CancelAction from '../../../src/actions/cancel';

import Version from '../../../src/version';
const CURRENT_VERSION = Version.currentVersion;

import * as TestData from '../utils/test-data-generator';

/* tslint:disable:no-unused-expression */
describe('actions/cancel', () => {
  describe('format', () => {
    it('can cancel without extensionsData', () => {
      const actionCancel = CancelAction.format(
        {
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );

      expect(actionCancel.data.name, 'action is wrong').to.equal(
        Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
      );

      expect(actionCancel.data.parameters.requestId, 'requestId is wrong').to.equal(
        TestData.requestIdMock,
      );
      expect(actionCancel.data.parameters.extensionsData, 'extensionsData is wrong').to.be
        .undefined;

      expect(actionCancel, 'actionCancel.signature is wrong').to.have.property('signature');
      expect(actionCancel.signature.method, 'actionCancel.signature.method is wrong').to.equal(
        SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
      );
      expect(actionCancel.signature.value, 'actionCancel.signature.value').to.equal(
        '0xb522bf1c5aad3d3914cee8a2c485506113473535dc9cc555d6cb53a920689155215f059d0c18c32fb455799f97e72fbe4fde477dd1136778e25aa1c396bea1f91b',
      );
    });

    it('can cancel with extensionsData', () => {
      const actionCancel = CancelAction.format(
        {
          extensionsData: TestData.oneExtension,
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );

      expect(actionCancel.data.name, 'action is wrong').to.equal(
        Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
      );

      expect(actionCancel.data.parameters.requestId, 'requestId is wrong').to.equal(
        TestData.requestIdMock,
      );
      expect(actionCancel.data.parameters.extensionsData, 'extensionsData is wrong').to.deep.equal(
        TestData.oneExtension,
      );

      expect(actionCancel, 'actionCancel.signature is wrong').to.have.property('signature');
      expect(actionCancel.signature.method, 'actionCancel.signature.method is wrong').to.equal(
        SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
      );
      expect(actionCancel.signature.value, 'actionCancel.signature.value').to.equal(
        '0xc7160f386f55bd4ad8bade960ac774279f1bdad321be6d292414f0cdff56f96914f773936de056a36aa0e8eb76def70b08f951692aa74b5c29502bcf487f73431b',
      );
    });
  });

  describe('applyActionToRequest', () => {
    it('can cancel by payer with state === created', () => {
      const actionCancel = CancelAction.format(
        {
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );
      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestCreatedNoExtension),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'extensionsData is wrong').to.be.undefined;

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }

      expect(request.events[1], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payerRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 0 },
      });
    });
    it('cannot cancel by payer with state === accepted', () => {
      try {
        const actionCancel = CancelAction.format(
          {
            requestId: TestData.requestIdMock,
          },
          {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            privateKey: TestData.payerRaw.privateKey,
          },
        );

        CancelAction.applyActionToRequest(
          actionCancel,
          Utils.deepCopy(TestData.requestAcceptedNoExtension),
        );

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'A payer cancel need to be done on a request with the state created',
        );
      }
    });
    it('cannot cancel by payer with state === cancelled', () => {
      try {
        const actionCancel = CancelAction.format(
          {
            requestId: TestData.requestIdMock,
          },
          {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            privateKey: TestData.payerRaw.privateKey,
          },
        );

        CancelAction.applyActionToRequest(
          actionCancel,
          Utils.deepCopy(TestData.requestCancelledNoExtension),
        );

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'A payer cancel need to be done on a request with the state created',
        );
      }
    });

    it('can cancel by payee with state === created', () => {
      const actionCancel = CancelAction.format(
        {
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payeeRaw.privateKey,
        },
      );
      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestCreatedNoExtension),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'extensionsData is wrong').to.be.undefined;

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }
      expect(request.events[1], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payeeRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 0 },
      });
    });
    it('can cancel by payee with state === accepted', () => {
      const actionCancel = CancelAction.format(
        {
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payeeRaw.privateKey,
        },
      );

      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestAcceptedNoExtension),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'extensionsData is wrong').to.be.undefined;

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }
      expect(request.events[2], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payeeRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 0 },
      });
    });
    it('cannot cancel by payee with state === cancelled', () => {
      try {
        const actionCancel = CancelAction.format(
          {
            requestId: TestData.requestIdMock,
          },
          {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            privateKey: TestData.payeeRaw.privateKey,
          },
        );
        CancelAction.applyActionToRequest(
          actionCancel,
          Utils.deepCopy(TestData.requestCancelledNoExtension),
        );

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'Cannot cancel an already cancelled request',
        );
      }
    });

    it('cannot cancel by thirdparty', () => {
      try {
        const actionCancel = CancelAction.format(
          {
            requestId: TestData.requestIdMock,
          },
          {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            privateKey: TestData.otherIdRaw.privateKey,
          },
        );

        CancelAction.applyActionToRequest(
          actionCancel,
          Utils.deepCopy(TestData.requestCreatedNoExtension),
        );

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'Signer must be the payer or the payee',
        );
      }
    });

    it('cannot cancel if no requestId', () => {
      try {
        const action = {
          data: {
            name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
            parameters: {},
            version: CURRENT_VERSION,
          },
          signature: {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            value:
              '0xdd44c2d34cba689921c60043a78e189b4aa35d5940723bf98b9bb9083385de316333204ce3bbeced32afe2ea203b76153d523d924c4dca4a1d9fc466e0160f071c',
          },
        };
        CancelAction.applyActionToRequest(
          action,
          Utils.deepCopy(TestData.requestCreatedNoExtension),
        );

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal('requestId must be given');
      }
    });
    it('cannot cancel by payer if no payer in state', () => {
      const requestContextNoPayer = {
        creator: {
          type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
          value: TestData.payeeRaw.address,
        },
        currency: Types.REQUEST_LOGIC_CURRENCY.ETH,
        events: [
          {
            actionSigner: {
              type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
              value: TestData.payeeRaw.address,
            },
            name: Types.REQUEST_LOGIC_ACTION_NAME.CREATE,
            parameters: {
              expectedAmount: '123400000000000000',
              extensionsDataLength: 0,
              isSignedRequest: false,
            },
          },
        ],
        expectedAmount: TestData.arbitraryExpectedAmount,
        payee: {
          type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
          value: TestData.payeeRaw.address,
        },
        requestId: TestData.requestIdMock,
        state: Types.REQUEST_LOGIC_STATE.CREATED,
        version: CURRENT_VERSION,
      };
      try {
        const action = {
          data: {
            name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
            parameters: {
              requestId: TestData.requestIdMock,
            },
            version: CURRENT_VERSION,
          },
          signature: {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            value:
              '0xdd44c2d34cba689921c60043a78e189b4aa35d5940723bf98b9bb9083385de316333204ce3bbeced32afe2ea203b76153d523d924c4dca4a1d9fc466e0160f071c',
          },
        };
        CancelAction.applyActionToRequest(action, requestContextNoPayer);

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'Signer must be the payer or the payee',
        );
      }
    });
    it('cannot cancel by payee if no payee in state', () => {
      const requestContextNoPayee = {
        creator: {
          type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
          value: TestData.payeeRaw.address,
        },
        currency: Types.REQUEST_LOGIC_CURRENCY.ETH,
        events: [
          {
            actionSigner: {
              type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
              value: TestData.payeeRaw.address,
            },
            name: Types.REQUEST_LOGIC_ACTION_NAME.CREATE,
            parameters: {
              expectedAmount: '123400000000000000',
              extensionsDataLength: 0,
              isSignedRequest: false,
            },
          },
        ],
        expectedAmount: TestData.arbitraryExpectedAmount,
        payer: {
          type: IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
          value: TestData.payerRaw.address,
        },
        requestId: TestData.requestIdMock,
        state: Types.REQUEST_LOGIC_STATE.CREATED,
        version: CURRENT_VERSION,
      };
      try {
        const action = {
          data: {
            name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
            parameters: {
              requestId: TestData.requestIdMock,
            },
            version: CURRENT_VERSION,
          },
          signature: {
            method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
            value:
              '0xdd44c2d34cba689921c60043a78e189b4aa35d5940723bf98b9bb9083385de316333204ce3bbeced32afe2ea203b76153d523d924c4dca4a1d9fc466e0160f071c',
          },
        };
        CancelAction.applyActionToRequest(action, requestContextNoPayee);

        expect(false, 'exception not thrown').to.be.true;
      } catch (e) {
        expect(e.message, 'exception not right').to.be.equal(
          'Signer must be the payer or the payee',
        );
      }
    });
    it('can cancel with extensionsData and no extensionsData before', () => {
      const newExtensionsData = [{ id: 'extension1', value: 'whatever' }];
      const actionCancel = CancelAction.format(
        {
          extensionsData: newExtensionsData,
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );

      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestCreatedNoExtension),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'request.extensionsData is wrong').to.deep.equal(
        newExtensionsData,
      );

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }
      expect(request.events[1], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payerRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 1 },
      });
    });

    it('can cancel with extensionsData and extensionsData before', () => {
      const newExtensionsData = [{ id: 'extension1', value: 'whatever' }];
      const actionCancel = CancelAction.format(
        {
          extensionsData: newExtensionsData,
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );

      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestCreatedWithExtensions),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'request.extensionsData is wrong').to.deep.equal(
        TestData.oneExtension.concat(newExtensionsData),
      );

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }
      expect(request.events[1], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payerRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 1 },
      });
    });
    it('can cancel without extensionsData and extensionsData before', () => {
      const actionCancel = CancelAction.format(
        {
          requestId: TestData.requestIdMock,
        },
        {
          method: SignatureTypes.REQUEST_SIGNATURE_METHOD.ECDSA,
          privateKey: TestData.payerRaw.privateKey,
        },
      );

      const request = CancelAction.applyActionToRequest(
        actionCancel,
        Utils.deepCopy(TestData.requestCreatedWithExtensions),
      );

      expect(request.requestId, 'requestId is wrong').to.equal(TestData.requestIdMock);
      expect(request.currency, 'currency is wrong').to.equal(Types.REQUEST_LOGIC_CURRENCY.ETH);
      expect(request.state, 'state is wrong').to.equal(Types.REQUEST_LOGIC_STATE.CANCELLED);
      expect(request.expectedAmount, 'expectedAmount is wrong').to.equal(
        TestData.arbitraryExpectedAmount,
      );
      expect(request.extensionsData, 'request.extensionsData is wrong').to.deep.equal(
        TestData.oneExtension,
      );

      expect(request, 'request should have property creator').to.have.property('creator');
      expect(request.creator.type, 'request.creator.type is wrong').to.equal(
        IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
      );
      expect(request.creator.value, 'request.creator.value is wrong').to.equal(
        TestData.payeeRaw.address,
      );

      expect(request, 'request should have property payee').to.have.property('payee');
      if (request.payee) {
        expect(request.payee.type, 'request.payee.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payee.value, 'request.payee.value is wrong').to.equal(
          TestData.payeeRaw.address,
        );
      }
      expect(request, 'request should have property payer').to.have.property('payer');
      if (request.payer) {
        expect(request.payer.type, 'request.payer.type is wrong').to.equal(
          IdentityTypes.REQUEST_IDENTITY_TYPE.ETHEREUM_ADDRESS,
        );
        expect(request.payer.value, 'request.payer.value is wrong').to.equal(
          TestData.payerRaw.address,
        );
      }
      expect(request.events[1], 'request.events is wrong').to.deep.equal({
        actionSigner: TestData.payerRaw.identity,
        name: Types.REQUEST_LOGIC_ACTION_NAME.CANCEL,
        parameters: { extensionsDataLength: 0 },
      });
    });
  });
});