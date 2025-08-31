import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface StyleSelectorProps {
  currentIndex: number;
  totalStyles: number;
  currentStyleName: string;
  onPrevious: () => void;
  onNext: () => void;
}

export function StyleSelector({
  currentIndex,
  totalStyles,
  currentStyleName,
  onPrevious,
  onNext,
}: StyleSelectorProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="flex items-center justify-center w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-lg shadow-md hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        <ChevronLeftIcon className="w-6 h-6 text-amber-700" />
      </button>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-lg px-8 py-4 shadow-lg min-w-[200px] text-center">
        <h2 className="text-2xl font-serif text-amber-900 font-bold">
          {currentStyleName}
        </h2>
        <p className="text-sm text-amber-600 mt-1">
          Style {currentIndex + 1} of {totalStyles}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={currentIndex === totalStyles - 1}
        className="flex items-center justify-center w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-lg shadow-md hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
      >
        <ChevronRightIcon className="w-6 h-6 text-amber-700" />
      </button>
    </div>
  );
}
