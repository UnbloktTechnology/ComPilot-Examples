import { Router } from 'express';
import { WebhookController } from '../controllers/WebhookController';
import { IWebSocketServer } from '../websocket';

/**
 * Webhook routes for the ComPilot Customer Screening System.
 * Handles incoming webhooks from ComPilot and broadcasts them via WebSocket.
 
 * @param wsServer - WebSocket server instance for broadcasting updates
 * @returns Express Router configured with webhook endpoints
 */
export function createWebhookRoutes(wsServer: IWebSocketServer) {
    const router = Router();
    const webhookController = new WebhookController(wsServer);
    router.post('/', webhookController.handleWebhook);
    return router;
} 