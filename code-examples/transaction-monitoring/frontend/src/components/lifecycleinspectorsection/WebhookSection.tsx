import { TransactionLog } from '@/types/devmode';
import { LogSection } from './LogSection';

const WebhookEntry = ({ webhook }: { webhook: TransactionLog['webhooks'][0] }) => (
  <div className="border-t border-gray-800 pt-4 first:border-0 first:pt-0">
    <div className="text-gray-400">
      Received at: <span className="text-yellow-500">{webhook.timestamp}</span>
    </div>
    <div className="text-gray-400 mt-2">Event Type:</div>
    <pre className="text-green-500">{webhook.body.eventType}</pre>
    <div className="text-gray-400 mt-2">Payload:</div>
    <pre className="text-blue-400">{JSON.stringify(webhook.body.payload, null, 2)}</pre>
  </div>
);

interface WebhooksSectionProps {
  webhooks: TransactionLog['webhooks'];
  transactionId?: string;
}

export const WebhooksSection = ({ webhooks, transactionId }: WebhooksSectionProps) => {
  const relevantWebhooks = webhooks.filter(
    webhook => webhook.body.payload.transactionId === transactionId
  );

  if (relevantWebhooks.length === 0) return null;

  return (
    <LogSection title={`Webhooks (${relevantWebhooks.length})`} defaultOpen={true}>
      <div className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
        <div className="space-y-4">
          {relevantWebhooks.map((webhook, index) => (
            <WebhookEntry key={index} webhook={webhook} />
          ))}
        </div>
      </div>
    </LogSection>
  );
}; 