import { Router } from 'express';
import { TransactionController } from '../controllers/transactions';

const router = Router();

router.post('/transactions', TransactionController.submitTransaction);
// router.get('/:id', TransactionController.getTransactionStatus);

export const transactionRoutes = router; 