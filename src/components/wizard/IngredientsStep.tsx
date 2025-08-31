import { useState } from 'react';
import { type Ingredient } from '../../types';
import { TransferList } from '../display/TransferList';
import { Modal } from '../ui/Modal';

interface IngredientModalContentProps {
  ingredient: Ingredient;
}

function IngredientModalContent({ ingredient }: IngredientModalContentProps) {
  const getVirtueColor = (value: number) => {
    if (value > 0) return 'text-green-600 bg-green-100';
    if (value < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getVirtueIcon = (value: number) => {
    if (value > 0) return '+';
    if (value < 0) return '';
    return '±';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-amber-600 mb-2">
          ${ingredient.price.toFixed(2)}
        </div>
        <div className="text-sm text-gray-600">Cost per unit</div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Virtue Effects
        </h3>
        <div className="space-y-3">
          {Object.entries(ingredient.virtues).map(([virtue, value]) => (
            <div
              key={virtue}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="font-medium text-gray-800">{virtue}</div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-bold ${getVirtueColor(value)}`}
              >
                {getVirtueIcon(value)}
                {Math.abs(value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface IngredientsStepProps {
  ingredients: Ingredient[];
  selectedIngredients: string[];
  onSelectionChange: (selection: string[]) => void;
}

export function IngredientsStep({
  ingredients,
  selectedIngredients,
  onSelectionChange,
}: IngredientsStepProps) {
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <TransferList
          ingredients={ingredients}
          selectedIngredients={selectedIngredients}
          onSelectionChange={onSelectionChange}
          onIngredientClick={handleIngredientClick}
        />
      </div>

      {selectedIngredients.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🍺</div>
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            No ingredients selected yet
          </h4>
          <p className="text-gray-500">
            Use the transfer list above to select the ingredients you have
            available for brewing. You need at least one ingredient to proceed.
          </p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedIngredient?.name}
        maxWidth="md"
      >
        {selectedIngredient && (
          <IngredientModalContent ingredient={selectedIngredient} />
        )}
      </Modal>
    </div>
  );
}
