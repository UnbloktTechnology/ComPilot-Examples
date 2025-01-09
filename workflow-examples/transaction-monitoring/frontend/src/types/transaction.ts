export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface TransactionResponse {
    id: string;
    status: TransactionStatus;
    message?: string;
}

interface Institution {
  name?: string;
  code?: string;
  address?: {
    formatted?: string;
    country?: string;
  };
}

export interface Transaction {
    customerId: string;
    externalTransactionId: string;
    transactionDate: string;
    transactionType: 'crypto' | 'fiat';
    transactionSubType?: string;
    transactionInfo: {
        direction: 'IN' | 'OUT';
        currencyCode: string;
        blockchain?: string;
        chainId?: string;
        hash?: string;
        amount: number;
        fees?: {
            networkFeeAmount?: number;
            platformFeeAmount?: number;
            networkFeeCurrencyCode?: string;
            platformFeeCurrencyCode?: string;
        };
    };
    originator: {
        type: 'individual' | 'company';
        name: string;
        partyId: string | null;
        address: {
            formatted: string | null;
            country: string | null;
        };
        transactionMethod: {
            type: 'crypto' | 'card' | 'account';
            accountId: string;
            issuingCountry?: string;
            threeDsUsed?: string;
        };
        institution: Partial<Institution>;
    };
    beneficiary: {
        type: 'individual' | 'company';
        name: string;
        partyId: string | null;
        address: {
            formatted: string | null;
            country: string | null;
        };
        transactionMethod: {
            type: 'crypto' | 'card' | 'account';
            accountId: string;
            issuingCountry?: string;
        };
        institution: Partial<Institution>;
    };
}