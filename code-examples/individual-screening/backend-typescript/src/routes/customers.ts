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
 * - GET /:customerId/wallets: Get wallet details for a customer
 * - GET /:customerId/details: Get customer details
 * 
 * Note: These routes are mounted at /api/customers in index.ts
 * So the full path would be /api/customers/
 */
const router = Router();

router.post('/', CustomerController.submitCustomer);
router.get('/:customerId/wallets', CustomerController.getWalletDetails);
router.get('/:customerId/details', CustomerController.getCustomerDetails);

export const customerRoutes = router;
