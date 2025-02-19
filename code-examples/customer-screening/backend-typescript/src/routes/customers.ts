import { Router } from 'express';
import { CustomerController } from '../controllers/customers';

/**
 * Customer routes for the ComPilot Customer Screening System.
 * Handles all customer screening-related endpoints.
 * 
 * Available Routes:
 * - POST /: Submit a new customer for screening
 *   - Request body should contain customer details
 *   - Returns screening response from ComPilot API
 * 
 * Note: These routes are mounted at /api/customers in index.ts
 * So the full path would be /api/customers/
 */
const router = Router();

router.post('/', CustomerController.submitCustomer);

export const customerRoutes = router;
