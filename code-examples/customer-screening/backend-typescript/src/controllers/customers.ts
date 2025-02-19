import { Request, Response } from 'express';
import { ComPilotService } from '../services/compilot';
import { Customer } from '../types/customer';

/**
 * Controller handling customer screening submissions to ComPilot.
 * This controller:
 * 1. Receives customer screening requests from clients
 * 2. Validates and formats customer data
 * 3. Submits screening requests to ComPilot API
 * 4. Returns API responses to clients
 * 
 * Endpoints:
 * - POST /api/customers: Submit a new customer screening
 */
export class CustomerController {
    /**
     * Handles customer screening submission requests.
     * 1. Validates the customer data
     * 2. Submits to ComPilot API
     * 3. Returns the API response
     */
    static async submitCustomer(req: Request, res: Response) {
        try {
            const customer: Customer = req.body;
            console.log('📨 Received customer request:', {
                workspaceId: customer.workspaceId,
                organizationId: customer.organizationId,
                workflowId: customer.workflowId,
                nationality: customer.customerPersonalInformation.nationality
            });

            const response = await ComPilotService.submitCustomerScreening(customer);
            console.log('✅ Customer screening submitted successfully:', response);
            res.json(response);
        } catch (error) {
            console.error('❌ Customer screening error:', error);
            console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 