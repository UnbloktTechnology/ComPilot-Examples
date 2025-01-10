export type TransactionStatus = string;

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

export interface TransactionResponse {
    id: string;
    status: TransactionStatus;
    error?: string;
}

interface Institution {
  name?: string;
  code?: string;
  address?: {
    formatted?: string;
    country?: string;
  };
}

export interface TransactionLog {
  id?: string;
  apiRequest?: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: any;
  };
  apiResponse?: {
    status: number;
    body: any;
  };
  webhooks: Array<{
    timestamp: string;
    body: {
      eventType: string;
      payload: {
        transactionId: string;
        status: TransactionStatus;
        id: string;
      };
    };
  }>;
}

export interface TransactionState {
  id?: string;
  apiStatus: 'idle' | 'pending' | 'approved' | 'error';
  webhookStatus: TransactionStatus | null;
  error?: string;
}

// Props types for components
export interface LogSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface WebhookEntryProps {
  webhook: TransactionLog['webhooks'][0];
}

export interface WebhooksSectionProps {
  webhooks: TransactionLog['webhooks'];
  transactionId?: string;
}