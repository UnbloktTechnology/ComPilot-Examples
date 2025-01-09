import { Request, Response } from 'express';
import { ComPilotService } from '../services/compilot';
import { Transaction } from '../types/transaction';

export class TransactionController {
    static async submitTransaction(req: Request, res: Response) {
        try {
            const transaction: Transaction = req.body;

            console.log('💰 Processing transaction:', {
                type: transaction.transactionType,
                subType: transaction.transactionSubType,
                direction: transaction.transactionInfo.direction,
                amount: transaction.transactionInfo.amount,
                currency: transaction.transactionInfo.currencyCode
            });

            const response = await ComPilotService.submitTransaction(transaction);

            console.log('✅ Transaction submitted successfully:', response);
            res.json(response);
        } catch (error) {
            console.error('❌ Transaction error:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
} 