import { CustomerLog } from '@/hooks/useCustomerWebSocket';

interface LogSectionProps {
  title?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  logs?: CustomerLog[];
  onGetWalletDetails?: () => void;
  customerDetails?: any;
}

export const LogSection = ({ title = "Webhooks", children, logs, onGetWalletDetails, customerDetails }: LogSectionProps) => {
  if (logs) {
    return logs.length > 0 ? (
      <div className="mt-4 p-4 bg-[#1E2025] rounded-lg w-full">
        <h2 className="text-lg font-semibold mb-2">Webhooks ({logs.length})</h2>
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="p-2 border border-gray-700 rounded">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Received at: {new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`px-2 rounded ${log.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
                  {log.status}
                </span>
              </div>
              {log.details && (
                <div className="mt-2 text-sm text-gray-400 break-all">
                  <pre className="whitespace-pre-wrap overflow-x-auto max-w-full">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
        {logs.length > 0 && !customerDetails && (
          <button
            onClick={onGetWalletDetails}
            className="mt-4 w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            Get Customer Details
          </button>
        )}
        {customerDetails && (
          <div className="mt-4 bg-[#2C2F36] p-3 rounded">
            <h3 className="text-sm font-semibold mb-2">Customer Details</h3>
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(customerDetails, null, 2)}
            </pre>
          </div>
        )}
      </div>
    ) : null;
  }

  return (
    <div className="mt-4 p-4 bg-[#1E2025] rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}; 