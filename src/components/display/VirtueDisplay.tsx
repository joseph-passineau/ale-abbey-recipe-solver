interface VirtueDisplayProps {
  virtue: string;
  value: number;
  score?: number;
}

const getVirtueColor = (value: number) => {
  if (value === 2) return 'text-green-600 bg-green-100';
  if (value === 1) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

const getVirtueLabel = (value: number) => {
  if (value === 2) return 'Good';
  if (value === 1) return 'Neutral';
  return 'Bad';
};

export function VirtueDisplay({ virtue, value, score }: VirtueDisplayProps) {
  return (
    <div className="flex justify-between items-center p-4 rounded-lg border">
      <div className="font-medium text-gray-800">{virtue}</div>
      <div className="flex items-center space-x-3">
        {score !== undefined && (
          <div className="text-lg font-bold text-gray-700">{score}</div>
        )}
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${getVirtueColor(value)}`}
        >
          {getVirtueLabel(value)}
        </div>
      </div>
    </div>
  );
}
