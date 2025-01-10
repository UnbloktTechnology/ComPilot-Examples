import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

interface LogSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const LogSection = ({ title, children, defaultOpen = true }: LogSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-800 rounded">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-2 hover:bg-[#2C2F36] transition-colors"
      >
        <h4 className="text-xs font-medium text-gray-400">{title}</h4>
        {isOpen ? 
          <ChevronDownIcon className="h-4 w-4 text-gray-400" /> : 
          <ChevronRightIcon className="h-4 w-4 text-gray-400" />
        }
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-800">
          {children}
        </div>
      )}
    </div>
  );
}; 