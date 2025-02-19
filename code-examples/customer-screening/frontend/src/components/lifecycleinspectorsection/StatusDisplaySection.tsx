import { CustomerResponse } from '@/hooks/useCustomerApi';

interface StatusDisplaySectionProps {
  response: CustomerResponse | null;
}

export const StatusDisplaySection = ({ response }: StatusDisplaySectionProps) => 
  response ? (
    <div className="mt-4 p-4 bg-[#1E2025] rounded-lg">
      <h2 className="text-lg font-semibold mb-2">API Response</h2>
      <div className="font-mono text-sm whitespace-pre-wrap text-gray-300 bg-[#2C2F36] p-3 rounded">
        {JSON.stringify(response, null, 2)}
      </div>
    </div>
  ) : null;