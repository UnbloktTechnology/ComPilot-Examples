import { Router } from 'express';
import { WebhookController } from '../controllers/webhooks';

const router = Router();

router.post('/compilot', WebhookController.handleWebhook);

export const webhookRoutes = router; 