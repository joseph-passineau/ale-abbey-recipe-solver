import { type Ingredient } from '../../types';

interface IngredientListProps {
  ingredients: Ingredient[];
  selectedIngredients: string[];
  onToggle: (ingredientName: string) => void;
  onItemClick?: (ingredient: Ingredient) => void;
  title: string;
  emptyMessage?: string;
}

export function IngredientList({
  ingredients,
  selectedIngredients,
  onToggle,
  onItemClick,
  title,
  emptyMessage = 'No ingredients available',
}: IngredientListProps) {
  return (
    <div className="bg-white border-2 border-amber-200 rounded-lg shadow-lg">
      <div className="bg-amber-100 px-4 py-3 border-b-2 border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
        <p className="text-sm text-amber-700">
          {selectedIngredients.length} of {ingredients.length} selected
        </p>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {ingredients.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          ingredients.map(ingredient => (
            <div
              key={ingredient.name}
              className="flex items-center px-4 py-3 hover:bg-amber-50 border-b border-amber-100 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={selectedIngredients.includes(ingredient.name)}
                onChange={() => onToggle(ingredient.name)}
                className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
              />
              <div
                className={`ml-3 flex-1 ${onItemClick ? 'cursor-pointer hover:text-amber-600' : ''} transition-colors`}
                onClick={() => onItemClick?.(ingredient)}
              >
                <div className="text-sm font-medium text-gray-900 hover:text-amber-600">
                  {ingredient.name}
                </div>
                <div className="text-xs text-gray-500">
                  ${ingredient.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
