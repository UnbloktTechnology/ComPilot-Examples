import { transactionExamples } from '@/lib/transaction-examples';

interface TransactionTypeSelectorSectionProps {
  onSelect: (category: 'crypto' | 'fiat', direction: 'in' | 'out') => void;
}

export const TransactionTypeSelectorSection = ({ onSelect }: TransactionTypeSelectorSectionProps) => (
  <div className="flex-grow overflow-y-auto">
    <div className="space-y-4">
      <div>
        <h4 className="text-xs text-gray-400 mb-1">Crypto</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('crypto', 'in')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {transactionExamples.crypto.in.description}
          </button>
          <button
            onClick={() => onSelect('crypto', 'out')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {transactionExamples.crypto.out.description}
          </button>
        </div>
      </div>
      <div>
        <h4 className="text-xs text-gray-400 mb-1">Fiat</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('fiat', 'in')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {transactionExamples.fiat.in.description}
          </button>
          <button
            onClick={() => onSelect('fiat', 'out')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {transactionExamples.fiat.out.description}
          </button>
        </div>
      </div>
    </div>
  </div>
); 