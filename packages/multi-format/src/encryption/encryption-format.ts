import { MultiFormatGroup } from '../multi-format-group';
import { Aes256CbcMultiFormat } from './aes256-cbc-format';
import { Aes256GcmMultiFormat } from './aes256-gcm-format';
import { ECIESMultiFormat } from './ecies-format';

export const encryptionFormats = new MultiFormatGroup([
  new Aes256CbcMultiFormat(),
  new ECIESMultiFormat(),
  new Aes256GcmMultiFormat(),
]);
