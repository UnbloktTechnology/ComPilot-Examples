import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { transactionRoutes } from './routes/transactions';
import { webhookRoutes } from './routes/webhooks';

const app = express();
const port = process.env.PORT || 8080;  // Fallback to 8080 if PORT is not set

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', transactionRoutes);
app.use('/api/webhooks', webhookRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 