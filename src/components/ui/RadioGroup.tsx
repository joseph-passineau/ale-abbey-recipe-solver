interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className = '',
}: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-amber-600 focus:ring-amber-500"
          />
          <div>
            <div className="font-medium text-gray-800">{option.label}</div>
            {option.description && (
              <div className="text-sm text-gray-600">{option.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
