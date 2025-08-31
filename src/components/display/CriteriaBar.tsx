import { Outcome } from '../../types';

interface CriteriaBarProps {
  label: string;
  values: number[];
}

const getColor = (value: number) => {
  switch (value) {
    case Outcome.Bad:
      return 'bg-red-500';
    case Outcome.Neutral:
      return 'bg-yellow-500';
    case Outcome.Good:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

const getOutcomeLabel = (value: number) => {
  switch (value) {
    case Outcome.Bad:
      return 'Bad';
    case Outcome.Neutral:
      return 'Neutral';
    case Outcome.Good:
      return 'Good';
    default:
      return 'Unknown';
  }
};

export function CriteriaBar({ label, values }: CriteriaBarProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-4">
        <h3 className="text-base font-semibold text-gray-800 w-20">{label}</h3>
        <div className="flex-1 bg-amber-50 border border-amber-200 rounded-md p-2">
          <div className="flex h-6 rounded overflow-hidden">
            {values.map((value, index) => (
              <div
                key={index}
                className={`flex-1 ${getColor(value)} transition-all duration-300 hover:brightness-110 border-r border-white`}
                title={`${label} ${index + 1}: ${getOutcomeLabel(value)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
