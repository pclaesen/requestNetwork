// tslint:disable:object-literal-sort-keys
export const exampleAddressInfo = {
  address: 'mgPKDuVmuS9oeE2D9VPiCQriyU14wxWS1v',
  total_received: 50500000,
  total_sent: 50000000,
  balance: 500000,
  unconfirmed_balance: 0,
  final_balance: 500000,
  n_tx: 3,
  unconfirmed_n_tx: 0,
  final_n_tx: 3,
  txrefs: [
    {
      tx_hash: '2ff7b73cb1b0dca6ccf079f9ad1d92832f9c56176e5181310c7c453dac7e477e',
      block_height: 1354205,
      tx_input_n: 0,
      tx_output_n: -1,
      value: 50000000,
      ref_balance: 500000,
      confirmations: 165779,
      confirmed: '2018-07-18T02:21:36Z',
      double_spend: false,
    },
    {
      tx_hash: '2a14f1ad2dfa4601bdc7a6be325241bbdc2ae99d05f096357fda76264b1c5c26',
      block_height: 1354204,
      tx_input_n: -1,
      tx_output_n: 0,
      value: 500000,
      ref_balance: 50500000,
      spent: false,
      confirmations: 165780,
      confirmed: '2018-07-18T02:14:08Z',
      double_spend: false,
    },
    {
      tx_hash: '7d84924c034798dedcc95f479c9cdb24fe014437f7ce0ee0c2f4bf3580e017d8',
      block_height: 1354075,
      tx_input_n: -1,
      tx_output_n: 1,
      value: 50000000,
      ref_balance: 50000000,
      spent: true,
      spent_by: '2ff7b73cb1b0dca6ccf079f9ad1d92832f9c56176e5181310c7c453dac7e477e',
      confirmations: 165909,
      confirmed: '2018-07-17T09:06:07Z',
      double_spend: false,
    },
  ],
  tx_url: 'https://api.blockcypher.com/v1/btc/test3/txs/',
};