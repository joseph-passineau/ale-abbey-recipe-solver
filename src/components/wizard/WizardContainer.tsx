import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { type ReactNode } from 'react';
import { PageLayout } from '../layout/PageLayout';

interface WizardStep {
  id: string;
  title: string;
  description: string;
}

interface WizardContainerProps {
  steps: WizardStep[];
  currentStep: number;
  children: ReactNode;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextButtonText?: string;
}

export function WizardContainer({
  steps,
  currentStep,
  children,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  nextButtonText = 'Next',
}: WizardContainerProps) {
  return (
    <PageLayout
      title="Ale Abbey Recipe Solver"
      subtitle="Master the art of brewing with our intelligent recipe optimization"
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep]?.title}
            </h2>
            <p className="text-lg text-gray-600">
              {steps[currentStep]?.description}
            </p>
          </div>

          <div className="min-h-[400px]">{children}</div>
        </div>
        <div className="flex justify-between items-center">
          {currentStep > 0 ? (
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`
                flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${
                  canGoPrevious
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Previous
            </button>
          ) : (
            <div></div>
          )}

          <div className="text-center text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                canGoNext
                  ? 'bg-amber-600 text-white hover:bg-amber-700 hover:shadow-lg transform hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {nextButtonText}
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
