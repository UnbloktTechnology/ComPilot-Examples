import { useState, useEffect } from 'react';

export type CustomerStatus = 'active' | 'failed' | 'rejected' | 'under_review';

export interface CustomerLog {
  id: string;
  status: 'active' | 'failed' | 'rejected' | 'under_review';
  timestamp: string;
  details: {
    eventType: string;
    payload: {
      customerId: string;
      externalCustomerId: string;
      status: string;
    }
  };
}

export const useCustomerWebSocket = (customerId?: string) => {
  const [logs, setLogs] = useState<CustomerLog[]>([]);
  const [status, setStatus] = useState<CustomerStatus | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!customerId) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log('🎯 WebSocket message received:', event.data);
      const webhookData = JSON.parse(event.data);
      
      setLogs(prev => [...prev, {
        id: webhookData.payload.externalId,
        status: webhookData.payload.status,
        timestamp: new Date().toISOString(),
        details: webhookData
      }]);
      
      setStatus(webhookData.payload.status);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [customerId]);

  return { logs, status, connected };
}; 