"use client";

import { useState, useEffect, useCallback } from 'react';
import { TransactionResponse, TransactionStatus } from '../types/transaction';
import { transactionExamples } from '@/lib/transaction-examples';
import { Transaction } from '@/types/transaction';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'crypto_in' | 'crypto_out' | 'fiat_in' | 'fiat_out';
}

// Custodian wallet address to receive crypto - fake address for example purpose.
const WALLET_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f7BB';

export const TransactionModal = ({ isOpen, onClose, type }: TransactionModalProps) => {
    const [amount, setAmount] = useState<string>('');
    const [status, setStatus] = useState<TransactionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currency, setCurrency] = useState(type.startsWith('crypto') ? 'ETH' : 'USD');
    const [targetWallet, setTargetWallet] = useState('');
    const [cardNumber, setCardNumber] = useState('');

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
            // Pré-remplir le numéro de carte quand la modale s'ouvre pour les transactions fiat
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
        if (parts.length > 2) return value;

        // Limit decimal places
        if (parts[1]) {
            parts[1] = parts[1].slice(0, isCrypto ? 8 : 2);
        }

        return parts.join('.');
    };

    const getCurrencyOptions = () => {
        return type.startsWith('crypto') ?
            [{ value: 'ETH', label: 'ETH' }, { value: 'BTC', label: 'BTC' }] :
            [{ value: 'EUR', label: 'EUR' }, { value: 'USD', label: 'USD' }];
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

            // Create new transaction with updated values
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

            // Update transaction methods based on input
            if (type === 'crypto_out' && targetWallet) {
                transaction.beneficiary.transactionMethod.accountId = targetWallet;
            }
            if (type.startsWith('fiat_') && cardNumber) {
                transaction.originator.transactionMethod.accountId = cardNumber;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction)
            });

            const data: TransactionResponse = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Transaction failed');
            }

            // Don't update status here, wait for webhook
            // setStatus(data.status);

            // Set up WebSocket connection for real-time updates
            const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws`);
            ws.onmessage = (event) => {
                const webhookData = JSON.parse(event.data);
                if (webhookData.transactionId === data.id) {
                    setStatus(webhookData.status);
                    if (webhookData.status !== 'pending') {
                        ws.close();
                    }
                }
            };

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Transaction failed');
            setStatus(null);
        }
    };

    if (!isOpen) return null;

    if (type === 'crypto_in') {
        return (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-gray-900 p-8 rounded-xl w-[440px] shadow-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            Receive Crypto
                        </h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Warning Message */}
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
                            <div className="flex items-start text-red-500">
                                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <p className="font-medium">Do not copy this wallet</p>
                                    <p className="text-sm mt-1 text-red-500/80">
                                        This is a demonstration site. Never send real funds to this address. This wallet address is for example purposes only.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Your Wallet Address
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={WALLET_ADDRESS}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white pr-20"
                                />
                                <button
                                    onClick={() => navigator.clipboard.writeText(WALLET_ADDRESS)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-400">
                                This is your unique deposit address for receiving crypto. Double-check before sending any funds.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 p-8 rounded-xl w-[440px] shadow-xl border border-gray-800">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                        {type.startsWith('crypto') ?
                            (type.endsWith('in') ? 'Receive Crypto' : 'Send Crypto') :
                            (type.endsWith('in') ? 'Deposit Fiat' : 'Withdraw Fiat')}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center text-red-500">
                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="space-y-6">
                    {status === null ? (
                        <>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Amount
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => {
                                                    const formatted = formatAmount(e.target.value, type.startsWith('crypto'));
                                                    setAmount(formatted);
                                                }}
                                                step={type.startsWith('crypto') ? "0.00000001" : "0.01"}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white text-right pr-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                                {currency}
                                            </span>
                                        </div>
                                        <select
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white"
                                        >
                                            {getCurrencyOptions().map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Wallet address input for crypto send */}
                                {type === 'crypto_out' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Target Wallet Address
                                        </label>
                                        <input
                                            type="text"
                                            value={targetWallet}
                                            onChange={(e) => setTargetWallet(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-white"
                                            placeholder="Enter wallet address"
                                        />
                                    </div>
                                )}

                                {/* Card number input for fiat transactions */}
                                {type.startsWith('fiat_') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
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
                    ) : status === 'completed' ? (
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
                            <p className="text-gray-400 mb-6">Something went wrong with your transaction</p>
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

export default TransactionModal; 