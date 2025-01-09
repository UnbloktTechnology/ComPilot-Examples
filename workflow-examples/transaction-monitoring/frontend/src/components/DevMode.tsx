'use client';

import { useState } from 'react';
import { transactionExamples } from '@/lib/transaction-examples';
import { Transaction, TransactionStatus, TransactionResponse } from '@/types/transaction';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface TransactionState {
  id?: string;
  apiStatus: 'idle' | 'pending' | 'success' | 'error';
  webhookStatus: TransactionStatus | null;
  error?: string;
}

interface TransactionLog {
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
  webhooks: {
    timestamp: string;
    body: {
      transactionId: string;
      status: TransactionStatus;
      message?: string;
    };
  }[];
}

const LogSection = ({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-800 rounded">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 hover:bg-[#2C2F36] transition-colors"
      >
        <h4 className="text-xs font-medium text-gray-400">{title}</h4>
        {isOpen ? (
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
};

const DevMode = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<string>(
    JSON.stringify(transactionExamples.crypto.in.data, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    apiStatus: 'idle',
    webhookStatus: null
  });
  const [transactionLog, setTransactionLog] = useState<TransactionLog>({
    webhooks: []
  });

  const handleExampleSelect = (category: 'crypto' | 'fiat', direction: 'in' | 'out') => {
    setSelectedTransaction(JSON.stringify(transactionExamples[category][direction].data, null, 2));
    setJsonError(null);
  };

  const handleJsonChange = (value: string) => {
    setSelectedTransaction(value);
  };

  const handleSubmit = async () => {
    try {
      if (jsonError) return;

      setTransactionState({ apiStatus: 'pending', webhookStatus: null });
      
      const apiRequest = {
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.parse(selectedTransaction)
      };

      setTransactionLog({
        webhooks: [],
        apiRequest
      });

      const response = await fetch(apiRequest.url, {
        method: apiRequest.method,
        headers: apiRequest.headers,
        body: JSON.stringify(apiRequest.body)
      });

      const data = await response.json();
      
      setTransactionLog(prev => ({
        ...prev,
        id: data.id,
        apiResponse: {
          status: response.status,
          body: data
        }
      }));

      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed');
      }

      setTransactionState({
        id: data.id,
        apiStatus: 'success',
        webhookStatus: 'pending'
      });

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);
      ws.onmessage = (event) => {
        const webhookData = JSON.parse(event.data);
        if (webhookData.transactionId === data.id) {
          setTransactionState(prev => ({
            ...prev,
            webhookStatus: webhookData.status
          }));
          
          setTransactionLog(prev => ({
            ...prev,
            webhooks: [...prev.webhooks, {
              timestamp: new Date().toISOString(),
              body: webhookData
            }]
          }));

          if (webhookData.status !== 'pending') {
            ws.close();
          }
        }
      };

    } catch (error) {
      setTransactionState({
        apiStatus: 'error',
        webhookStatus: null,
        error: error instanceof Error ? error.message : 'Failed to submit transaction'
      });
    }
  };

  return (
    <div className="px-[10vw] py-4">
      <h1 className="text-xl font-bold mb-4">Test transactions workflow</h1>
      
      {/* Top Section: Controls and JSON Editor side by side */}
      <div className="grid grid-cols-[1fr,1.618fr] gap-6 mb-6">
        {/* Left Panel - Controls */}
        <div className="flex flex-col h-[450px]">
          {/* Top: Transaction Types */}
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-gray-400 mb-1">Crypto</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleExampleSelect('crypto', 'in')}
                    className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
                  >
                    {transactionExamples.crypto.in.description}
                  </button>
                  <button
                    onClick={() => handleExampleSelect('crypto', 'out')}
                    className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
                  >
                    {transactionExamples.crypto.out.description}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-xs text-gray-400 mb-1">Fiat</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleExampleSelect('fiat', 'in')}
                    className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
                  >
                    {transactionExamples.fiat.in.description}
                  </button>
                  <button
                    onClick={() => handleExampleSelect('fiat', 'out')}
                    className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
                  >
                    {transactionExamples.fiat.out.description}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Submit Button */}
          <div className="py-4">
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!!jsonError}
                className="w-1/2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Transaction
              </button>
            </div>
          </div>

          {/* Bottom: Transaction Status */}
          <div className="h-[150px]">
            <div className="h-full p-3 bg-[#1E2025] rounded-lg border border-gray-800">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-400">API Call:</span>
                  <span className={`ml-2 ${
                    transactionState.apiStatus === 'success' ? 'text-green-500' :
                    transactionState.apiStatus === 'error' ? 'text-red-500' :
                    transactionState.apiStatus === 'pending' ? 'text-yellow-500' :
                    'text-gray-500'
                  }`}>
                    {transactionState.apiStatus === 'idle' ? 'Not Started' :
                     transactionState.apiStatus === 'pending' ? 'Processing...' :
                     transactionState.apiStatus === 'success' ? 'Success' : 'Error'}
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
                  <span className={`ml-2 ${
                    transactionState.webhookStatus === 'completed' ? 'text-green-500' :
                    transactionState.webhookStatus === 'failed' ? 'text-red-500' :
                    transactionState.webhookStatus === 'pending' ? 'text-yellow-500' :
                    'text-gray-500'
                  }`}>
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
        </div>

        {/* Right Panel - JSON Editor */}
        <div className="h-[450px]">
          <div className="h-full">
            <div className="h-[42px]">
              <span className="text-green-500 font-mono">POST</span>
              <span className="text-gray-400 ml-2 font-mono">/transactions</span>
            </div>
            {jsonError && (
              <div className="text-red-500 text-sm mb-2">{jsonError}</div>
            )}
            <textarea
              className="w-full h-[408px] bg-[#1E2025] text-white font-mono text-xs p-3 rounded-lg"
              value={selectedTransaction}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Transaction Log */}
      <div className="bg-[#1E2025] rounded-lg border border-gray-800">
        <div className="border-b border-gray-800 p-2">
          <h3 className="text-sm font-medium">Transaction Log</h3>
        </div>
        <div className="p-3 space-y-3">
          {/* API Request */}
          {transactionLog.apiRequest && (
            <LogSection title="API Request">
              <div className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
                <div className="text-green-500">
                  {transactionLog.apiRequest.method} {transactionLog.apiRequest.url}
                </div>
                <div className="text-gray-400 mt-2">Headers:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(transactionLog.apiRequest.headers, null, 2)}
                </pre>
                <div className="text-gray-400 mt-2">Body:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(transactionLog.apiRequest.body, null, 2)}
                </pre>
              </div>
            </LogSection>
          )}

          {/* API Response */}
          {transactionLog.apiResponse && (
            <LogSection title="API Response">
              <div className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
                <div className={`${
                  transactionLog.apiResponse.status < 300 ? 'text-green-500' : 'text-red-500'
                }`}>
                  Status: {transactionLog.apiResponse.status}
                </div>
                <div className="text-gray-400 mt-2">Body:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(transactionLog.apiResponse.body, null, 2)}
                </pre>
              </div>
            </LogSection>
          )}

          {/* Webhooks */}
          {transactionLog.webhooks.length > 0 && (
            <LogSection title="Webhooks">
              <div className="space-y-3">
                {transactionLog.webhooks.map((webhook, index) => (
                  <div key={index} className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
                    <div className="text-gray-400">
                      Received at: <span className="text-yellow-500">{webhook.timestamp}</span>
                    </div>
                    <div className="text-gray-400 mt-2">Body:</div>
                    <pre className="text-blue-400">
                      {JSON.stringify(webhook.body, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </LogSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevMode; 