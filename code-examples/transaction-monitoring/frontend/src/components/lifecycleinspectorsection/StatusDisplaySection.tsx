import { TransactionState } from '@/types/devmode';
import { TransactionStatus } from '@/types/transaction';

interface StatusDisplaySectionProps {
  transactionState: TransactionState;
}

const getStatusColor = (status: TransactionStatus) => {
  switch(status) {
    case 'approved': return 'text-green-500';
    case 'blocked': return 'text-red-500';
    case 'pending': return 'text-yellow-500';
    default: return 'text-gray-500';
  }
};

export const StatusDisplaySection = ({ transactionState }: StatusDisplaySectionProps) => (
  <div className="h-[150px]">
    <div className="h-full p-3 bg-[#1E2025] rounded-lg border border-gray-800">
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-gray-400">API Call:</span>
          <span className={`ml-2 ${getStatusColor(transactionState.apiStatus)}`}>
            {transactionState.apiStatus}
          </span>
        </div>
        
        {transactionState.id && (
          <div>
            <span className="text-gray-400">Transaction ID:</span>
            <span className="ml-2 text-blue-400">{transactionState.id}</span>
          </div>
        )}

        <div>
          <span className="text-gray-400">Webhook Status:</span>
          <span className={`ml-2 ${transactionState.webhookStatus ? getStatusColor(transactionState.webhookStatus) : 'text-gray-500'}`}>
            {transactionState.webhookStatus || 'Waiting...'}
          </span>
        </div>

        {transactionState.error && (
          <div className="text-red-500">
            Error: {transactionState.error}
          </div>
        )}
      </div>
    </div>
  </div>
); 