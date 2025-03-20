import { Router } from 'express';
import { customerRoutes } from './customers';
import { createWebhookRoutes } from './webhookRoutes';
import { IWebSocketServer } from '../websocket';

export function createRouter(wsServer: IWebSocketServer) {
  const router = Router();
  
  router.use('/customers', customerRoutes);
  router.use('/webhooks', createWebhookRoutes(wsServer));
  
  return router;
} 