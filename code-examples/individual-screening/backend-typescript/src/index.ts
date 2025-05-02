import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from './websocket';

import { WebhookController } from './controllers/WebhookController';
import { createRouter } from './routes/index';

/**
 * ComPilot Customer Screening System - TypescriptBackend Server
 * 
 * This server provides:
 * 1. REST API endpoints for Customer Screening
 * 2. Webhook endpoints for receiving ComPilot updates
 * 3. WebSocket server for real-time updates to clients
 * 
 * Required environment variables:
 * - PORT: Server port (default: 8080)
 * - WEBHOOK_SECRET: ComPilot webhook signing secret
 * - COMPILOT_API_URL: ComPilot API base URL
 * - COMPILOT_API_KEY: ComPilot API key
 */

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server (required for WebSocket support)
const server = createServer(app);

// Initialize WebSocket server for real-time updates
const wsServer = new WebSocketServer(server);

// Root webhook endpoint
app.post('/', (req, res) => {
    const webhookController = new WebhookController(wsServer);
    return webhookController.handleWebhook(req, res);
});

// API routes
app.use('/api', createRouter(wsServer));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app; 