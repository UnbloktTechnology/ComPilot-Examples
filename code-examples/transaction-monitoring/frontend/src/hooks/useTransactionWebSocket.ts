import { useState, useEffect, useCallback } from 'react';
import { TransactionLog } from '@/types/devmode';

/**
 * Hook to handle WebSocket connections for real-time transaction updates
 * @param transactionId - The ID of the transaction to monitor
 * @param onStatusUpdate - Callback function to handle transaction status updates
 * @returns Object containing the webhooks history
 */
export const useTransactionWebSocket = (transactionId?: string, onStatusUpdate?: (status: string) => void) => {
  // Store webhook history for the transaction
  const [webhooks, setWebhooks] = useState<TransactionLog['webhooks']>([]);

  // Handler for incoming webhook messages
  const handleWebhook = useCallback((webhookData: any) => {
    console.log('[WebSocket] Received data:', webhookData);
    
    // Only process webhooks for the current transaction
    if (webhookData.payload?.transactionId === transactionId) {
      console.log('[WebSocket] Matching transaction ID:', transactionId);
      
      setWebhooks(prev => {
        // Prevent duplicate webhooks by comparing timestamps
        const isDuplicate = prev.some(webhook => 
          webhook.body.eventType === webhookData.eventType && 
          webhook.body.payload.updatedAt === webhookData.payload.updatedAt
        );

        if (isDuplicate) {
          console.log('[WebSocket] Duplicate webhook, ignoring');
          return prev;
        }

        // Handle transaction status updates
        if (webhookData.eventType === 'transaction.updated') {
          console.log('[WebSocket] Status update:', webhookData.payload.status);
          onStatusUpdate?.(webhookData.payload.status);
        }

        // Add new webhook to history
        return [...prev, {
          timestamp: new Date().toISOString(),
          body: webhookData
        }];
      });
    }
  }, [transactionId, onStatusUpdate]);

  // Set up WebSocket connection
  useEffect(() => {
    console.log('[WebSocket] Setting up with transaction ID:', transactionId);
    
    if (!transactionId) {
      console.log('[WebSocket] No transaction ID, skipping setup');
      return;
    }

    // Create WebSocket connection
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws`;
    console.log('[WebSocket] Attempting connection to:', wsUrl);
    const ws = new WebSocket(wsUrl);

    // Connection handlers
    ws.onopen = () => {
      console.log('[WebSocket] Connection established, readyState:', ws.readyState);
    };

    ws.onmessage = (event) => {
      try {
        const webhookData = JSON.parse(event.data);
        handleWebhook(webhookData);
      } catch (error) {
        console.error('[WebSocket] Parse error:', error);
      }
    };

    // Keep connection alive - no cleanup to maintain persistent connection
  }, [transactionId, handleWebhook]);

  return { webhooks };
}; 