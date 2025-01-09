import { Request, Response } from 'express';
import { WebSocketServer } from '../websocket';

export class WebhookController {
    private static wsServer: WebSocketServer;

    static setWebSocketServer(server: WebSocketServer) {
        WebhookController.wsServer = server;
    }

    static async handleWebhook(req: Request, res: Response) {
        try {
            // Log incoming webhook
            console.log('📥 Webhook received:', {
                timestamp: new Date().toISOString(),
                payload: req.body.payload
            });

            const { status, transactionId } = req.body.payload;
            console.log('✅ Transaction update:', { status, transactionId });

            // Broadcast the update to all connected clients
            if (WebhookController.wsServer) {
                WebhookController.wsServer.broadcastWebhook({
                    transactionId,
                    status,
                    timestamp: new Date().toISOString()
                });
            }

            res.json({ received: true });
        } catch (error) {
            console.error('❌ Webhook error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 