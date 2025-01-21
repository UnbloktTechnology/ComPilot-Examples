interface JsonEditorSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export const JsonEditorSection = ({ value, onChange, error }: JsonEditorSectionProps) => (
  <div className="h-[450px]">
    <div className="h-full">
      <div className="h-[42px]">
        <span className="text-green-500 font-mono">POST</span>
        <span className="text-gray-400 ml-2 font-mono">/workflows/workflowID/transactions</span>
      </div>
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      <textarea
        className="w-full h-[408px] bg-[#1E2025] text-white font-mono text-xs p-3 rounded-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  </div>
); 