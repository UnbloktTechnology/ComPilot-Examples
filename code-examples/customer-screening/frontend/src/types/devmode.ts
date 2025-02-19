export type ApiCallStatus = 'pending' | 'success' | 'error';

export type CustomerStatus = 'active' | 'failed' | 'rejected' | 'under_review';

export interface CustomerWebhookLog {
  timestamp: string;
  body: {
    eventType: string;
    payload: {
      externalId: string;
      status: CustomerStatus;
      message?: string;
      details?: Record<string, unknown>;
    };
  };
}

export interface WebhookLogEntry {
  timestamp: string;
  body: CustomerWebhookLog;
}

export interface LogSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export interface WebhooksSectionProps {
  webhooks: CustomerWebhookLog[];
}