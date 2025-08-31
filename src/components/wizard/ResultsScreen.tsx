import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { Ingredient, Solution, Style } from '../../types';
import { PageLayout } from '../layout/PageLayout';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ResultsScreenProps {
  solution: Solution | null;
  error: string | null;
  loading: boolean;
  style: Style;
  ingredients: Ingredient[];
  onReset: () => void;
  onBackToConstraints: () => void;
}

function LoadingView({ style }: { style: Style }) {
  return (
    <PageLayout background="amber">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-2xl p-12 text-center max-w-lg mx-auto">
          <LoadingSpinner size="lg" className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Brewing the Perfect Recipe
          </h2>
          <p className="text-gray-600 mb-2">
            Our master brewer AI is analyzing your ingredients...
          </p>
          <div className="text-sm text-amber-600 animate-pulse">
            Optimizing for {style.name}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function ErrorView({
  error,
  onReset,
  onBackToConstraints,
}: {
  error: string;
  onReset: () => void;
  onBackToConstraints: () => void;
}) {
  return (
    <PageLayout background="red">
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-2xl mx-auto">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onBackToConstraints} variant="primary">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button onClick={onReset} variant="danger">
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              Start Over
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export function ResultsScreen({
  solution,
  error,
  loading,
  style,
  ingredients,
  onReset,
  onBackToConstraints,
}: ResultsScreenProps) {
  if (loading) {
    return <LoadingView style={style} />;
  }

  if (error) {
    return (
      <ErrorView
        error={error}
        onReset={onReset}
        onBackToConstraints={onBackToConstraints}
      />
    );
  }

  if (!solution) {
    return null;
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

  const calculateVirtueScores = () => {
    const rawVirtues = { Flavor: 0, Colour: 0, Strength: 0, Foam: 0 };

    Object.entries(solution.recipe).forEach(([ingredientName, quantity]) => {
      const ingredient = ingredients.find(ing => ing.name === ingredientName);
      if (ingredient) {
        Object.entries(ingredient.virtues).forEach(([virtue, value]) => {
          rawVirtues[virtue as keyof typeof rawVirtues] += value * quantity;
        });
      }
    });

    return rawVirtues;
  };

  const virtueScores = calculateVirtueScores();
  const recipeIngredients = Object.entries(solution.recipe);
  const totalIngredients = Object.values(solution.recipe).reduce(
    (sum, qty) => sum + qty,
    0
  );

  return (
    <PageLayout
      background="green"
      title="Perfect Recipe Found!"
      subtitle={`Your optimized ${style.name} brewing recipe`}
    >
      <div className="text-center mb-8">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            🍺 Your Recipe
          </h2>

          <div className="space-y-4 mb-6">
            {recipeIngredients.map(([ingredient, quantity]) => (
              <div
                key={ingredient}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-800">{ingredient}</div>
                  <div className="text-sm text-gray-600">
                    {quantity} unit{quantity !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{quantity}×</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Ingredients:</span>
              <span className="font-bold text-gray-900">
                {totalIngredients} units
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Different Types:</span>
              <span className="font-bold text-gray-900">
                {recipeIngredients.length}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-800 font-medium">Total Cost:</span>
              <span className="font-bold text-green-600 text-xl">
                ${solution.totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            ⭐ Quality Achievement
          </h2>

          <div className="space-y-4 mb-6">
            {Object.entries(solution.virtues).map(([virtue, value]) => (
              <div
                key={virtue}
                className="flex justify-between items-center p-4 rounded-lg border"
              >
                <div className="font-medium text-gray-800">{virtue}</div>
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold text-gray-700">
                    {virtueScores[virtue as keyof typeof virtueScores]}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getVirtueColor(value)}`}
                  >
                    {getVirtueLabel(value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onReset}
          size="lg"
          className="flex items-center mx-auto"
        >
          <ArrowPathIcon className="w-6 h-6 mr-3" />
          Create Another Recipe
        </Button>
      </div>
      <div className="text-center mt-12 text-amber-700">
        <p className="text-sm">Enjoy your perfectly crafted {style.name}! 🍻</p>
      </div>
    </PageLayout>
  );
}
