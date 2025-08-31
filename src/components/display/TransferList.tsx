import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { type Ingredient } from '../../types';
import { IngredientList } from './IngredientList';

interface TransferListProps {
  ingredients: Ingredient[];
  selectedIngredients: string[];
  onSelectionChange: (selected: string[]) => void;
  onIngredientClick?: (ingredient: Ingredient) => void;
}

export function TransferList({
  ingredients,
  selectedIngredients,
  onSelectionChange,
  onIngredientClick,
}: TransferListProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const leftList = ingredients.filter(
    item => !selectedIngredients.includes(item.name)
  );
  const rightList = ingredients.filter(item =>
    selectedIngredients.includes(item.name)
  );

  const handleToggle = (value: string, side: 'left' | 'right') => {
    if (side === 'left') {
      setLeftChecked(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    } else {
      setRightChecked(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleMoveRight = () => {
    const newSelected = [...selectedIngredients, ...leftChecked];
    onSelectionChange(newSelected);
    setLeftChecked([]);
  };

  const handleMoveLeft = () => {
    const newSelected = selectedIngredients.filter(
      item => !rightChecked.includes(item)
    );
    onSelectionChange(newSelected);
    setRightChecked([]);
  };

  const handleMoveAllRight = () => {
    const allNames = ingredients.map(item => item.name);
    onSelectionChange(allNames);
    setLeftChecked([]);
  };

  const handleMoveAllLeft = () => {
    onSelectionChange([]);
    setRightChecked([]);
  };

  return (
    <div className="flex items-start space-x-4">
      <IngredientList
        ingredients={leftList}
        selectedIngredients={leftChecked}
        onToggle={value => handleToggle(value, 'left')}
        onItemClick={onIngredientClick}
        title="Available Ingredients"
        emptyMessage="All ingredients are selected"
      />

      <div className="flex flex-col space-y-2 pt-8">
        <button
          onClick={handleMoveRight}
          disabled={leftChecked.length === 0}
          className="flex items-center justify-center w-10 h-10 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move selected to right"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <button
          onClick={handleMoveLeft}
          disabled={rightChecked.length === 0}
          className="flex items-center justify-center w-10 h-10 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move selected to left"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={handleMoveAllRight}
          disabled={leftList.length === 0}
          className="flex items-center justify-center w-10 h-10 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold"
          title="Move all to right"
        >
          ≫
        </button>

        <button
          onClick={handleMoveAllLeft}
          disabled={rightList.length === 0}
          className="flex items-center justify-center w-10 h-10 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-bold"
          title="Move all to left"
        >
          ≪
        </button>
      </div>

      <IngredientList
        ingredients={rightList}
        selectedIngredients={rightChecked}
        onToggle={value => handleToggle(value, 'right')}
        onItemClick={onIngredientClick}
        title="Selected Ingredients"
        emptyMessage="No ingredients selected"
      />
    </div>
  );
}
