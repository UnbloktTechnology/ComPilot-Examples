import { CustomerLog } from '@/hooks/useCustomerWebSocket';

interface LogSectionProps {
  title?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  logs?: CustomerLog[];
}

export const LogSection = ({ title = "Webhooks", children, logs }: LogSectionProps) => {
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