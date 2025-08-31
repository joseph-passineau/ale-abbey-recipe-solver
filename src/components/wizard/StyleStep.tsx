import { type Style } from '../../types';
import { CriteriaBar } from '../display/CriteriaBar';
import { StyleSelector } from '../display/StyleSelector';

interface StyleStepProps {
  styles: Style[];
  currentStyleIndex: number;
  onStyleChange: (index: number) => void;
}

export function StyleStep({
  styles,
  currentStyleIndex,
  onStyleChange,
}: StyleStepProps) {
  const currentStyle = styles[currentStyleIndex];

  const handlePrevious = () => {
    if (currentStyleIndex > 0) {
      onStyleChange(currentStyleIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStyleIndex < styles.length - 1) {
      onStyleChange(currentStyleIndex + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <StyleSelector
            currentIndex={currentStyleIndex}
            totalStyles={styles.length}
            currentStyleName={currentStyle.name}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h4 className="text-lg font-medium text-gray-800 text-center mb-6">
          Requirements
        </h4>
        <CriteriaBar label="Flavor" values={currentStyle.criteria.Flavor} />
        <CriteriaBar label="Colour" values={currentStyle.criteria.Colour} />
        <CriteriaBar label="Strength" values={currentStyle.criteria.Strength} />
        <CriteriaBar label="Foam" values={currentStyle.criteria.Foam} />
      </div>
    </div>
  );
}
