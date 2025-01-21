'use client';

import { useState } from 'react';
import { transactionExamples } from '@/lib/transaction-examples';
import { TransactionState } from '@/types/devmode';
import { useTransactionApi } from '@/hooks/useTransactionApi';
import { useTransactionWebSocket } from '@/hooks/useTransactionWebSocket';
import { LogSection } from './lifecycleinspectorsection/LogSection';
import { WebhooksSection } from './lifecycleinspectorsection/WebhookSection';
import { TransactionTypeSelectorSection } from './lifecycleinspectorsection/TransactionTypeSelectorSection';
import { StatusDisplaySection } from './lifecycleinspectorsection/StatusDisplaySection';
import { JsonEditorSection } from './lifecycleinspectorsection/JsonEditorSection';

/**
 * Developer-focused component for testing and monitoring transactions
 * Provides a complete interface for:
 * - Selecting transaction types
 * - Editing transaction JSON
 * - Submitting transactions
 * - Monitoring API responses
 * - Tracking webhook updates
 */
const TransactionLifecycleInspector = () => {
  // Transaction state management
  const [selectedTransaction, setSelectedTransaction] = useState<string>(
    JSON.stringify(transactionExamples.crypto.in.data, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [transactionState, setTransactionState] = useState<TransactionState>({
    apiStatus: 'idle',
    webhookStatus: null
  });

  // API and WebSocket hooks
  const { makeApiCall, apiLog } = useTransactionApi();
  const { webhooks } = useTransactionWebSocket(
    transactionState.id,
    (newStatus) => {
      setTransactionState(prev => ({
        ...prev,
        webhookStatus: newStatus
      }));
    }
  );

  /**
   * Handles transaction example selection
   * Updates the JSON editor with the selected example
   */
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

      const data = await makeApiCall(selectedTransaction);
      
      setTransactionState({
        id: data.id,
        apiStatus: 'approved',
        webhookStatus: 'pending'
      });

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
      
      <div className="grid grid-cols-[1fr,1.618fr] gap-6 mb-6">
        {/* Left Panel */}
        <div className="flex flex-col h-[450px]">
          <TransactionTypeSelectorSection onSelect={handleExampleSelect} />
          
          <button
            onClick={handleSubmit}
            disabled={!!jsonError}
            className="w-1/2 mx-auto px-3 py-3 my-3 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Submit Transaction
          </button>

          <StatusDisplaySection transactionState={transactionState} />
        </div>

        {/* Right Panel */}
        <JsonEditorSection 
          value={selectedTransaction}
          onChange={handleJsonChange}
          error={jsonError}
        />
      </div>

      {/* Bottom Section: Transaction Log */}
      <div className="bg-[#1E2025] rounded-lg border border-gray-800">
        <div className="border-b border-gray-800 p-2">
          <h3 className="text-sm font-medium">Transaction Log</h3>
        </div>
        <div className="p-3 space-y-3">
          {/* API Request */}
          {apiLog.apiRequest && (
            <LogSection title="API Request">
              <div className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
                <div className="text-green-500">
                  {apiLog.apiRequest.method} {apiLog.apiRequest.url}
                </div>
                <div className="text-gray-400 mt-2">Headers:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(apiLog.apiRequest.headers, null, 2)}
                </pre>
                <div className="text-gray-400 mt-2">Body:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(apiLog.apiRequest.body, null, 2)}
                </pre>
              </div>
            </LogSection>
          )}

          {/* API Response */}
          {apiLog.apiResponse && (
            <LogSection title="API Response">
              <div className="bg-[#1A1B1E] p-3 rounded font-mono text-xs overflow-x-auto">
                <div className={`${
                  apiLog.apiResponse.status < 300 ? 'text-green-500' : 'text-red-500'
                }`}>
                  Status: {apiLog.apiResponse.status}
                </div>
                <div className="text-gray-400 mt-2">Body:</div>
                <pre className="text-blue-400">
                  {JSON.stringify(apiLog.apiResponse.body, null, 2)}
                </pre>
              </div>
            </LogSection>
          )}

          {/* Webhooks Section */}
          <WebhooksSection 
            webhooks={webhooks} 
            transactionId={apiLog.id} 
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionLifecycleInspector; 