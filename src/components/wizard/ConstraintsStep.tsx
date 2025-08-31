import { useCallback, useEffect, useState } from 'react';
import { Card } from '../layout/Card';
import { RadioGroup } from '../ui/RadioGroup';
import { Slider } from '../ui/Slider';

const MAX_INGREDIENTS = 25;

type VirtueQuality = 'Bad' | 'Neutral' | 'Good';

interface VirtueRequirements {
  Flavor: VirtueQuality;
  Color: VirtueQuality;
  Strength: VirtueQuality;
  Foam: VirtueQuality;
}

interface Constraints {
  maxIngredients: number;
  objective: 'cheapest' | 'fewestIngredients';
  minGoodVirtues: number;
  virtueRequirements: VirtueRequirements;
  requiredIngredients: string[];
}

interface ConstraintsStepProps {
  onConstraintsChange: (constraints: Constraints) => void;
  availableIngredients: string[];
}

const objectiveOptions = [
  {
    value: 'cheapest',
    label: 'Minimize Cost',
    description: 'Find the most affordable recipe that meets your requirements',
  },
  {
    value: 'fewestIngredients',
    label: 'Minimize Complexity',
    description: 'Use as few different ingredients as possible',
  },
];

const virtueOptions: { value: VirtueQuality; label: string; color: string }[] =
  [
    {
      value: 'Bad',
      label: 'Bad',
      color: 'text-red-600 bg-red-50 border-red-200',
    },
    {
      value: 'Neutral',
      label: 'Neutral',
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    },
    {
      value: 'Good',
      label: 'Good',
      color: 'text-green-600 bg-green-50 border-green-200',
    },
  ];

const getMinGoodVirtuesDescription = (value: number) => {
  switch (value) {
    case 0:
      return 'Accept any quality levels';
    case 1:
      return 'At least 1 virtue must be Good';
    case 2:
      return 'At least 2 virtues must be Good';
    case 3:
      return 'At least 3 virtues must be Good';
    case 4:
      return 'All 4 virtues must be Good (Perfect)';
    default:
      return '';
  }
};

const getVirtueRequirementsDescription = (requirements: VirtueRequirements) => {
  const requirementsList = Object.entries(requirements)
    .map(([virtue, quality]) => `${virtue}: ${quality}`)
    .join(', ');
  return requirementsList;
};

export function ConstraintsStep({
  onConstraintsChange,
  availableIngredients,
}: ConstraintsStepProps) {
  const [objective, setObjective] = useState<'cheapest' | 'fewestIngredients'>(
    'cheapest'
  );
  const [minGoodVirtues, setMinGoodVirtues] = useState(4);
  const [qualityMode, setQualityMode] = useState<'basic' | 'advanced'>('basic');
  const [virtueRequirements, setVirtueRequirements] =
    useState<VirtueRequirements>({
      Flavor: 'Good',
      Color: 'Good',
      Strength: 'Good',
      Foam: 'Good',
    });
  const [requiredIngredients, setRequiredIngredients] = useState<string[]>([]);

  const updateConstraints = useCallback(
    (updates: Partial<Constraints>) => {
      const constraints = {
        maxIngredients: MAX_INGREDIENTS,
        objective,
        minGoodVirtues,
        virtueRequirements,
        requiredIngredients,
        ...updates,
      };
      onConstraintsChange(constraints);
    },
    [
      objective,
      minGoodVirtues,
      virtueRequirements,
      requiredIngredients,
      onConstraintsChange,
    ]
  );

  const handleObjectiveChange = (value: string) => {
    const newObjective = value as 'cheapest' | 'fewestIngredients';
    setObjective(newObjective);
    updateConstraints({ objective: newObjective });
  };

  const handleMinGoodVirtuesChange = (value: number) => {
    setMinGoodVirtues(value);
    updateConstraints({ minGoodVirtues: value });
  };

  const handleQualityModeChange = (mode: 'basic' | 'advanced') => {
    setQualityMode(mode);
    if (mode === 'basic') {
      const goodCount = Object.values(virtueRequirements).filter(
        q => q === 'Good'
      ).length;
      setMinGoodVirtues(goodCount);
      updateConstraints({ minGoodVirtues: goodCount });
    } else {
      // In advanced mode, don't enforce minimum good virtues
      setMinGoodVirtues(0);
      updateConstraints({ minGoodVirtues: 0 });
    }
  };

  const handleVirtueQualityChange = (
    virtue: keyof VirtueRequirements,
    quality: VirtueQuality
  ) => {
    const updated = { ...virtueRequirements, [virtue]: quality };
    setVirtueRequirements(updated);
    updateConstraints({ virtueRequirements: updated });
  };

  const handleRequiredIngredientToggle = (ingredient: string) => {
    const updated = requiredIngredients.includes(ingredient)
      ? requiredIngredients.filter(i => i !== ingredient)
      : [...requiredIngredients, ingredient];
    setRequiredIngredients(updated);
    updateConstraints({ requiredIngredients: updated });
  };

  useEffect(() => {
    updateConstraints({});
  }, [updateConstraints]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <Card title="🎯 Optimization Goal">
          <RadioGroup
            name="objective"
            value={objective}
            onChange={handleObjectiveChange}
            options={objectiveOptions}
          />
        </Card>

        <Card title="⭐ Quality Requirements">
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Quality Mode:
              </span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleQualityModeChange('basic')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    qualityMode === 'basic'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => handleQualityModeChange('advanced')}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    qualityMode === 'advanced'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            {qualityMode === 'basic' ? (
              <Slider
                value={minGoodVirtues}
                onChange={handleMinGoodVirtuesChange}
                min={0}
                max={4}
                label="Minimum Good Virtues"
                formatValue={value => `${value} of 4`}
                description={getMinGoodVirtuesDescription(minGoodVirtues)}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select the quality requirement for each virtue individually
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(virtueRequirements).map(
                    ([virtue, currentQuality]) => (
                      <div
                        key={virtue}
                        className="flex items-center justify-between"
                      >
                        <label className="text-sm font-medium text-gray-700">
                          {virtue}
                        </label>
                        <div className="flex gap-2">
                          {virtueOptions.map(option => (
                            <button
                              key={option.value}
                              onClick={() =>
                                handleVirtueQualityChange(
                                  virtue as keyof VirtueRequirements,
                                  option.value
                                )
                              }
                              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                currentQuality === option.value
                                  ? `${option.color} border-current shadow-sm`
                                  : 'text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="🔒 Required Ingredients">
          {availableIngredients.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableIngredients.map(ingredient => (
                <label
                  key={ingredient}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={requiredIngredients.includes(ingredient)}
                    onChange={() => handleRequiredIngredientToggle(ingredient)}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
                  />
                  <span className="text-gray-800">{ingredient}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              Select ingredients in the previous step first
            </div>
          )}
          <div className="text-sm text-gray-600 mt-3">
            Force these ingredients to be included in the final recipe
          </div>
        </Card>
      </div>

      <div className="bg-amber-50 rounded-lg p-6 max-w-4xl mx-auto">
        <h4 className="text-lg font-medium text-amber-900 mb-3">
          📋 Constraint Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-amber-800">Goal:</span>{' '}
            <span className="text-amber-700">
              {objective === 'cheapest'
                ? 'Minimize Cost'
                : 'Minimize Complexity'}
            </span>
          </div>
          <div>
            <span className="font-medium text-amber-800">Quality:</span>{' '}
            <span className="text-amber-700">
              {qualityMode === 'basic'
                ? `${minGoodVirtues} of 4 virtues must be Good`
                : getVirtueRequirementsDescription(virtueRequirements)}
            </span>
          </div>
          <div>
            <span className="font-medium text-amber-800">Max Ingredients:</span>{' '}
            <span className="text-amber-700">{MAX_INGREDIENTS}</span>
          </div>
          <div>
            <span className="font-medium text-amber-800">Required:</span>{' '}
            <span className="text-amber-700">
              {requiredIngredients.length > 0
                ? requiredIngredients.join(', ')
                : 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
