"use client";

import { useState } from 'react';
import UXDemoModal from './uxdemosection/UXDemoModal';

/**
 * Type definition for different transaction actions available in the UI
 * Used to control which type of transaction modal to display
 */
type TransactionType = 'send' | 'receive' | 'deposit' | 'withdraw';

/**
 * Mock transaction data for demonstration purposes
 * In a real application, this would come from an API call
 */
const mockTransactions = [
    {
        id: '1',
        type: 'withdrawal',
        asset: 'EUR',
        amount: '-2423.20',
        subAmount: '-2423.2 EUR',
        date: 'Dec 29, 2024',
        status: 'completed'
    },
    {
        id: '2',
        type: 'sell',
        asset: 'ETH',
        amount: '-2454.78',
        subAmount: '-0.763 ETH',
        date: 'Dec 29, 2024',
        status: 'completed'
    },
    {
        id: '3',
        type: 'deposit',
        asset: 'EUR',
        amount: '+5.00',
        subAmount: '+5 EUR',
        date: 'Dec 29, 2024',
        status: 'completed'
    },
    {
        id: '4',
        type: 'receive',
        asset: 'ETH',
        amount: '+2456.15',
        subAmount: '+0.753 ETH',
        date: 'Dec 27, 2024',
        status: 'completed'
    }
];

/**
 * Maps user-facing transaction types to internal modal types
 * This conversion is necessary to match the backend API expectations
 */
const getModalType = (type: TransactionType): 'crypto_in' | 'crypto_out' | 'fiat_in' | 'fiat_out' => {
    switch (type) {
        case 'send': return 'crypto_out';
        case 'receive': return 'crypto_in';
        case 'deposit': return 'fiat_in';
        case 'withdraw': return 'fiat_out';
    }
};

/**
 * Configuration for quick action buttons
 * Each button represents a different type of transaction with its associated icon
 */
const transactionButtons = [
    { type: 'send', label: 'Send Crypto', icon: '↗️' },
    { type: 'receive', label: 'Receive Crypto', icon: '↙️' },
    { type: 'deposit', label: 'Deposit Fiat', icon: '💶' },
    { type: 'withdraw', label: 'Withdraw Fiat', icon: '💳' }
];

/**
 * Main transaction page component
 * Provides a user interface for:
 * - Initiating different types of transactions
 * - Viewing transaction history
 * - Managing user balance and account information
 */
export default function TransactionPage() {
    const [transactionType, setTransactionType] = useState<TransactionType>('send');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTransactionClick = (type: TransactionType) => {
        setTransactionType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header with gradient border */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">M</div>
                            <h1 className="text-xl font-semibold">MOCKMARKET</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-gray-300">Scott Murazik </span>
                            <div className="bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                                <span className="text-sm text-gray-400">Balance:</span>
                                <span className="ml-2 font-medium">13 ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with better spacing */}
            <main className="container mx-auto px-4 py-8">
                {/* Transaction Type Selector with subtle gradient background */}
                <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 mb-12">
                    <h2 className="text-lg font-medium text-gray-300 mb-4">Transactions</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {transactionButtons.map(({ type, label, icon }) => (
                            <button
                                key={type}
                                onClick={() => handleTransactionClick(type as TransactionType)}
                                className="p-6 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all flex flex-col items-center gap-3 group border border-gray-700 hover:border-gray-600"
                            >
                                <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
                                <span className="font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Transaction History with better styling */}
                <div className="bg-gray-800/30 rounded-xl border border-gray-700">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-semibold">Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="text-left text-gray-400 border-b border-gray-700">
                                    <tr>
                                        <th className="pb-4">Details</th>
                                        <th className="pb-4">Amount</th>
                                        <th className="pb-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {mockTransactions.map((transaction) => (
                                        <tr key={transaction.id} className="group hover:bg-gray-800/30 transition-colors">
                                            <td className="py-4 flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/20 mr-4 flex items-center justify-center text-blue-500">
                                                    {transaction.asset === 'ETH' ? 'Ξ' : '€'}
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {transaction.type === 'withdrawal' ? 'Funds withdrawn' :
                                                            transaction.type === 'sell' ? `${transaction.asset} sold` :
                                                                transaction.type === 'deposit' ? 'Funds deposited' :
                                                                    `${transaction.asset} received`}
                                                    </div>
                                                    <div className="text-sm text-gray-400">{transaction.subAmount}</div>
                                                </div>
                                            </td>
                                            <td className={`py-4 ${transaction.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'} font-medium`}>
                                                {transaction.amount} €
                                            </td>
                                            <td className="py-4 text-gray-400">{transaction.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            <UXDemoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={getModalType(transactionType)}
            />
        </div>
    );
} 