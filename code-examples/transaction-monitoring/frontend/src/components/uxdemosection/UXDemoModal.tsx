"use client";

import { useState, useEffect, useCallback } from 'react';
import {  TransactionStatus, Transaction } from '@/types/transaction';
import { transactionExamples } from '@/lib/transaction-examples';
import { useTransactionApi } from '@/hooks/useTransactionApi';
import { useTransactionWebSocket } from '@/hooks/useTransactionWebSocket';

interface UXDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'crypto_in' | 'crypto_out' | 'fiat_in' | 'fiat_out';
}

const WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f7BB';

/**
 * Modal component for handling transaction submissions in the UX demo
 * Provides a user-friendly interface for submitting different types of transactions
 * and displays their status updates in real-time
 */
export const UXDemoModal = ({ isOpen, onClose, type }: UXDemoModalProps) => {
    // Form state
    const [amount, setAmount] = useState<string>('');
    const [status, setStatus] = useState<TransactionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState(type.startsWith('crypto') ? 'ETH' : 'USD');
    const [targetWallet, setTargetWallet] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    // API and WebSocket hooks
    const { makeApiCall, apiLog } = useTransactionApi();
    const { webhooks } = useTransactionWebSocket(
        (status === 'pending' && apiLog?.id) ? apiLog.id : undefined,
        (newStatus) => {
            if (newStatus === 'pending') {
                setStatus('pending');
            } else if (newStatus === 'approved' || newStatus === 'blocked') {
                setStatus(newStatus);
            }
        }
    );

    // Add a timeout effect to handle cases where WebSocket doesn't connect
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;

        const checkTransaction = () => {
            if (status === 'pending') {
                console.log('Starting transaction status check...');
                timeoutId = setTimeout(() => {
                    console.log('Transaction status check timeout');
                    setError('Transaction status update timed out');
                    setStatus('error');
                }, 30000);
            }
        };

        if (apiLog?.id) {
            checkTransaction();
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [status, apiLog?.id]);

    // Reset all states when modal closes
    const resetModal = useCallback(() => {
        setAmount('');
        setStatus(null);
        setError(null);
        setCurrency(type.startsWith('crypto') ? 'ETH' : 'USD');
        setTargetWallet('');
        setCardNumber('');
    }, [type]);

    // Handle modal close
    const handleClose = () => {
        resetModal();
        onClose();
    };

    // Reset when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            resetModal();
        } else if (type.startsWith('fiat_')) {
            setCardNumber('4532981515473698');
        }
    }, [isOpen, type, resetModal]);

    useEffect(() => {
        setCurrency(type.startsWith('crypto') ? 'ETH' : 'USD');
    }, [type]);

    const formatAmount = (value: string, isCrypto: boolean) => {
        // Remove non-numeric characters except decimal point
        const cleanValue = value.replace(/[^\d.]/g, '');

        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        if (parts.length > 2) {
            return amount; // Return previous value if multiple decimal points
        }

        // Limit decimal places
        if (parts[1]) {
            parts[1] = parts[1].slice(0, isCrypto ? 8 : 2);
            return `${parts[0]}.${parts[1]}`;
        }

        return cleanValue;
    };

    const handleAmountChange = (value: string) => {
        const isCrypto = type.startsWith('crypto');
        const formattedValue = formatAmount(value, isCrypto);
        setAmount(formattedValue);
    };

    const handleSubmit = async () => {
        try {
            setError(null);
            setStatus('pending');

            // Validate fields
            if (type === 'crypto_out' && !targetWallet) {
                throw new Error('Target wallet address is required');
            }
            if (type.startsWith('fiat_') && !cardNumber) {
                throw new Error('Card number is required');
            }

            // Get base transaction from examples
            const baseTransaction = type.startsWith('crypto') 
                ? (type.endsWith('in') ? transactionExamples.crypto.in.data : transactionExamples.crypto.out.data)
                : (type.endsWith('in') ? transactionExamples.fiat.in.data : transactionExamples.fiat.out.data);

            // Create transaction object
            const transaction: Transaction = {
                ...baseTransaction,
                customerId: process.env.NEXT_PUBLIC_CUSTOMER_ID!,
                externalTransactionId: crypto.randomUUID(),
                transactionDate: new Date().toISOString(),
                transactionInfo: {
                    ...baseTransaction.transactionInfo,
                    amount: Number(amount),
                    currencyCode: currency
                }
            };

            // Update methods based on input
            if (type === 'crypto_out' && targetWallet) {
                transaction.beneficiary.transactionMethod.accountId = targetWallet;
            }
            if (type.startsWith('fiat_') && cardNumber) {
                transaction.originator.transactionMethod.accountId = cardNumber;
            }

            // Use our hook to make the API call
            await makeApiCall(JSON.stringify(transaction));
            // Don't set status here - wait for webhook
            
        } catch (error) {
            setStatus('error');
            setError(error instanceof Error ? error.message : 'Failed to submit transaction');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-800 p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">
                            {type === 'crypto_in' ? 'Receive Crypto' :
                             type === 'crypto_out' ? 'Send Crypto' :
                             type === 'fiat_in' ? 'Deposit Funds' : 'Withdraw Funds'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {!status ? (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Amount
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={amount}
                                            onChange={(e) => handleAmountChange(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <span className="text-gray-400">{currency}</span>
                                        </div>
                                    </div>
                                </div>

                                {type === 'crypto_in' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Your Wallet Address
                                        </label>
                                        <div className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm break-all">
                                            {WALLET_ADDRESS}
                                        </div>
                                    </div>
                                )}

                                {type === 'crypto_out' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Target Wallet Address
                                        </label>
                                        <input
                                            type="text"
                                            value={targetWallet}
                                            onChange={(e) => setTargetWallet(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white font-mono"
                                            placeholder="0x..."
                                        />
                                    </div>
                                )}

                                {type.startsWith('fiat_') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white"
                                            placeholder="4532 9815 1547 3698"
                                        />
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-all"
                                >
                                    Submit Transaction
                                </button>
                            </div>
                        </>
                    ) : status === 'pending' ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                            <p className="mt-4 text-gray-300">Processing your transaction...</p>
                            <p className="text-sm text-gray-500">This might take a few moments</p>
                        </div>
                    ) : status === 'approved' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-green-500 mb-2">Transaction Successful!</h3>
                            <p className="text-gray-400 mb-6">Your transaction has been processed successfully</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-red-500 mb-2">Transaction Failed</h3>
                            <p className="text-gray-400 mb-6">{error || 'Something went wrong with your transaction'}</p>
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UXDemoModal; 