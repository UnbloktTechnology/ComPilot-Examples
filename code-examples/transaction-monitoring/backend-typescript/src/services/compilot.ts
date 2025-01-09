import { Transaction } from '../types/transaction';

export class ComPilotService {
    static async submitTransaction(transaction: Transaction) {
        const response = await fetch(`${process.env.COMPILOT_API_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.COMPILOT_API_KEY}`
            },
            body: JSON.stringify(transaction)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`ComPilot API Error: ${JSON.stringify(data, null, 2)}`);
        }

        return data;
    }
} 