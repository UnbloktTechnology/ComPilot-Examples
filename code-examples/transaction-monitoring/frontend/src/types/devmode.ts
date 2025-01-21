import { Transaction, TransactionStatus, TransactionResponse } from './transaction';

export type ApiCallStatus = 'pending' | 'success' | 'error';

export interface TransactionState {
  id?: string;
  apiStatus: 'idle' | 'pending' | 'approved' | 'error';
  webhookStatus: TransactionStatus | null;
  error?: string;
}

export interface TransactionLog {
  id?: string;
  apiRequest?: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: Transaction;
  };
  apiResponse?: {
    status: number;
    body: TransactionResponse;
  };
  webhooks: WebhookLogEntry[];
}

export interface WebhookData {
  eventType: string;
  payload: {
    transactionId: string;
    status: TransactionStatus;
    id: string;
    updatedAt: string;
  };
}

export interface WebhookLogEntry {
  timestamp: string;
  body: WebhookData;
}

export interface LogSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface WebhookEntryProps {
  webhook: WebhookLogEntry;
}

export interface WebhooksSectionProps {
  webhooks: WebhookLogEntry[];
  transactionId?: string;
}