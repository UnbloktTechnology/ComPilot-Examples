import { customerExamples } from '@/lib/customer-examples';

interface CustomerTypeSelectorSectionProps {
  onSelect: (category: 'nationality' | 'age' | 'walletRisk' | 'amlHits', type: string) => void;
}

export const CustomerTypeSelectorSection = ({ onSelect }: CustomerTypeSelectorSectionProps) => (
  <div className="flex-grow overflow-y-auto">
    <div className="space-y-4">
      <div>
        <h4 className="text-xs text-gray-400 mb-1">Nationality</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('nationality', 'eu')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.nationality.eu.description}
          </button>
          <button
            onClick={() => onSelect('nationality', 'us')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.nationality.us.description}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-400 mb-1">Age</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('age', 'over18')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.age.over18.description}
          </button>
          <button
            onClick={() => onSelect('age', 'under18')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.age.under18.description}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-400 mb-1">Wallet Risk</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('walletRisk', 'low')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.walletRisk.low.description}
          </button>
          <button
            onClick={() => onSelect('walletRisk', 'high')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.walletRisk.high.description}
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs text-gray-400 mb-1">AML Hits</h4>
        <div className="space-y-1">
          <button
            onClick={() => onSelect('amlHits', 'has')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.amlHits.has.description}
          </button>
          <button
            onClick={() => onSelect('amlHits', 'none')}
            className="block w-full text-left px-3 py-1.5 text-sm text-blue-400 hover:bg-[#2C2F36] rounded"
          >
            {customerExamples.amlHits.none.description}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default CustomerTypeSelectorSection; 