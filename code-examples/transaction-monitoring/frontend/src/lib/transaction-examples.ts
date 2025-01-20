import { Transaction } from '@/types/transaction';

const customerId = process.env.NEXT_PUBLIC_CUSTOMER_ID || 'TO_REPLACE_WITH_EXISTING_CUSTOMER_ID';

export const transactionExamples = {
  crypto: {
    in: {
      description: "Crypto IN - ETH",
      data: {
        customerId: customerId,
        externalTransactionId: "f2b1a1d4-afc0-43d1-b868-d31ff825a384",
        transactionDate: "2025-01-08T08:11:22.149Z",
        transactionType: "crypto",
        transactionSubType: "wallet transfer",
        transactionInfo: {
          direction: "IN",
          currencyCode: "ETH",
          blockchain: "eip155",
          chainId: "1",
          hash: "0x89c195a8b61fb201ce1fb31c6c5c28d3915d49bbb83b86d634f5646e02d6b323",
          amount: 0.5,
          fees: {
            networkFeeAmount: 0.002,
            platformFeeAmount: 0.001,
            networkFeeCurrencyCode: "ETH",
            platformFeeCurrencyCode: "ETH"
          }
        },
        originator: {
          type: "individual",
          name: "Bob Smith",
          partyId: null,
          address: {
            formatted: null,
            country: null
          },
          transactionMethod: {
            type: "crypto",
            accountId: "0x7B5f55aE4f1Cb8a6bE0a9cD1FeE8F8C4cCfF9a3D"
          },
          institution: {}
        },
        beneficiary: {
          type: "individual",
          name: "Alice Carter",
          partyId: "6ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "101 Crypto Ave, Singapore",
            country: "SGP"
          },
          transactionMethod: {
            type: "crypto",
            accountId: "0x4E6f1cB8C7A2E3A2DeAb69c4e0A9F798D6FcF8B8"
          },
          institution: {
            name: "Binance",
            code: "BINANCE123"
          }
        }
      }
    },
    out: {
      description: "Crypto OUT - MATIC",
      data: {
        customerId: customerId,
        externalTransactionId: "21873154-6a63-40ba-8b67-32722d06695d",
        transactionDate: "2025-01-07T10:01:41.079Z",
        transactionType: "crypto",
        transactionSubType: "wallet transfer",
        transactionInfo: {
          direction: "OUT",
          currencyCode: "MATIC",
          blockchain: "eip155",
          chainId: "137",
          hash: "0x92c195a8b61fb201ce1fb31c6c5c28d3915d49bbb83b86d634f5646e02d6b456",
          amount: 100,
          fees: {
            networkFeeAmount: 0.1,
            platformFeeAmount: 0.05,
            networkFeeCurrencyCode: "MATIC",
            platformFeeCurrencyCode: "MATIC"
          }
        },
        originator: {
          type: "individual",
          name: "Alice Carter",
          partyId: "6ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "101 Crypto Ave, Singapore",
            country: "SGP"
          },
          transactionMethod: {
            type: "crypto",
            accountId: "0x4E6f1cB8C7A2E3A2DeAb69c4e0A9F798D6FcF8B8"
          },
          institution: {}
        },
        beneficiary: {
          type: "individual",
          name: "Bob Smith",
          partyId: null,
          address: {
            formatted: null,
            country: null
          },
          transactionMethod: {
            type: "crypto",
            accountId: "0x7B5f55aE4f1Cb8a6bE0a9cD1FeE8F8C4cCfF9a3D"
          },
          institution: {
            name: "Kraken",
            code: "KRAKEN123"
          }
        }
      }
    }
  },
  fiat: {
    in: {
      description: "Fiat IN - EUR",
      data: {
        customerId: customerId,
        externalTransactionId: "31873154-6a63-40ba-8b67-32722d06695d",
        transactionDate: "2025-01-07T10:01:41.079Z",
        transactionType: "fiat",
        transactionSubType: "card deposit",
        transactionInfo: {
          direction: "IN",
          currencyCode: "EUR",
          amount: 1000,
          fees: {
            platformFeeAmount: 2.5,
            platformFeeCurrencyCode: "EUR"
          }
        },
        originator: {
          type: "individual",
          name: "John Doe",
          partyId: "7ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "123 Bank St, Paris",
            country: "FRA"
          },
          transactionMethod: {
            type: "card",
            accountId: "4532981515473698",
            issuingCountry: "FRA",
            threeDsUsed: "true"
          },
          institution: {
            name: "BNP Paribas",
            code: "BNPAFRPP"
          }
        },
        beneficiary: {
          type: "company",
          name: "MockMarket Ltd",
          partyId: "8ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "1 Exchange Square, London",
            country: "GBR"
          },
          transactionMethod: {
            type: "account",
            accountId: "GB29NWBK60161331926819"
          },
          institution: {
            name: "Barclays",
            code: "BARCGB22"
          }
        }
      }
    },
    out: {
      description: "Fiat OUT - USD",
      data: {
        customerId: customerId,
        externalTransactionId: "41873154-6a63-40ba-8b67-32722d06695d",
        transactionDate: "2025-01-07T10:01:41.079Z",
        transactionType: "fiat",
        transactionSubType: "bank withdrawal",
        transactionInfo: {
          direction: "OUT",
          currencyCode: "USD",
          amount: 5000,
          fees: {
            platformFeeAmount: 5,
            platformFeeCurrencyCode: "USD"
          }
        },
        originator: {
          type: "company",
          name: "MockMarket Ltd",
          partyId: "8ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "1 Exchange Square, London",
            country: "GBR"
          },
          transactionMethod: {
            type: "account",
            accountId: "GB29NWBK60161331926819"
          },
          institution: {
            name: "Barclays",
            code: "BARCGB22"
          }
        },
        beneficiary: {
          type: "individual",
          name: "Jane Smith",
          partyId: "9ec8a3b2-8079-45f4-93da-27bb84bd90c4",
          address: {
            formatted: "456 Wall St, New York",
            country: "USA"
          },
          transactionMethod: {
            type: "account",
            accountId: "US29NWBK60161331926819"
          },
          institution: {
            name: "Chase",
            code: "CHASUS33"
          }
        }
      }
    }
  }
} as const;

export const getTransactionBody = (type: 'crypto' | 'fiat', direction: 'in' | 'out'): Transaction => {
  return transactionExamples[type][direction].data;
}; 