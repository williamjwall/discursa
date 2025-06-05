import React, { forwardRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = forwardRef(({ 
  className, 
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  label,
  error,
  disabled = false,
  size = 'md',
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-4 text-lg'
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500',
            sizes[size],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          {...props}
        >
          <span className={cn(
            'block truncate',
            !selectedOption && 'text-gray-500'
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown 
              className={cn(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )} 
            />
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-sm">No options available</div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option.value || index}
                  type="button"
                  className={cn(
                    'w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150',
                    selectedOption?.value === option.value && 'bg-blue-50 text-blue-700'
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <div className="flex items-center justify-between">
                    <span className="block truncate">{option.label}</span>
                    {selectedOption?.value === option.value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select }; 