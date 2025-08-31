import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useCallback, useMemo } from 'react';
import type { Ingredient, Solution, Style, Virtue } from '../../types';
import { Outcome } from '../../types';
import { PageLayout } from '../layout/PageLayout';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

const PRECISION_MULTIPLIER = 1000000;
const DECIMAL_PRECISION = 10;

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
          <XCircleIcon
            className="w-16 h-16 text-red-500 mx-auto mb-6"
            aria-label="Error"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onBackToConstraints} variant="primary">
              <ArrowLeftIcon className="w-5 h-5 mr-2" aria-label="Back arrow" />
              Back
            </Button>
            <Button onClick={onReset} variant="danger">
              <ArrowPathIcon
                className="w-5 h-5 mr-2"
                aria-label="Reset arrow"
              />
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
  const calculateVirtueScores = useCallback(() => {
    if (!solution) return null;

    const rawVirtues: Record<Virtue, number> = {
      Flavor: 0,
      Colour: 0,
      Strength: 0,
      Foam: 0,
    };

    Object.entries(solution.recipe).forEach(([ingredientName, quantity]) => {
      const ingredient = ingredients.find(ing => ing.name === ingredientName);
      if (ingredient) {
        Object.entries(ingredient.virtues).forEach(([virtue, value]) => {
          const contribution =
            Math.round(value * quantity * PRECISION_MULTIPLIER) /
            PRECISION_MULTIPLIER;
          rawVirtues[virtue as Virtue] += contribution;
        });
      }
    });

    return Object.fromEntries(
      Object.entries(rawVirtues).map(([virtue, value]) => [
        virtue,
        Math.round(value * DECIMAL_PRECISION) / DECIMAL_PRECISION,
      ])
    ) as Record<Virtue, number>;
  }, [solution, ingredients]);

  const virtueScores = useMemo(
    () => calculateVirtueScores(),
    [calculateVirtueScores]
  );

  const recipeIngredients = useMemo(
    () => (solution ? Object.entries(solution.recipe) : []),
    [solution]
  );

  const totalIngredients = useMemo(
    () =>
      solution
        ? Object.values(solution.recipe).reduce((sum, qty) => sum + qty, 0)
        : 0,
    [solution]
  );

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

  if (!solution || !virtueScores) {
    return null;
  }

  const getVirtueColor = (value: Outcome) => {
    if (value === Outcome.Good) return 'text-green-600 bg-green-100';
    if (value === Outcome.Neutral) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getVirtueLabel = (value: Outcome) => {
    if (value === Outcome.Good) return 'Good';
    if (value === Outcome.Neutral) return 'Neutral';
    return 'Bad';
  };

  return (
    <PageLayout
      background="green"
      title="Perfect Recipe Found!"
      subtitle={`Your optimized ${style.name} brewing recipe`}
    >
      <div className="text-center mb-8">
        <CheckCircleIcon
          className="w-20 h-20 text-green-500 mx-auto mb-4"
          aria-label="Success"
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section
          className="bg-white rounded-xl shadow-lg p-8"
          aria-labelledby="recipe-heading"
        >
          <h2
            id="recipe-heading"
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
          >
            🍺 Your Recipe
          </h2>

          <div className="space-y-4 mb-6">
            {recipeIngredients.map(([ingredient, quantity]) => {
              const roundedQuantity = Math.round(quantity);
              return (
                <div
                  key={ingredient}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-800">
                      {ingredient}
                    </div>
                    <div className="text-sm text-gray-600">
                      {roundedQuantity} unit{roundedQuantity !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {roundedQuantity}×
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Ingredients:</span>
              <span className="font-bold text-gray-900">
                {Math.round(totalIngredients)} unit
                {Math.round(totalIngredients) !== 1 ? 's' : ''}
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
        </section>

        <section
          className="bg-white rounded-xl shadow-lg p-8"
          aria-labelledby="quality-heading"
        >
          <h2
            id="quality-heading"
            className="text-2xl font-bold text-gray-800 mb-6 flex items-center"
          >
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
                    {virtueScores[virtue as Virtue]}
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
        </section>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={onReset}
          size="lg"
          className="flex items-center mx-auto"
        >
          <ArrowPathIcon
            className="w-6 h-6 mr-3"
            aria-label="Create new recipe"
          />
          Create Another Recipe
        </Button>
      </div>
      <div className="text-center mt-12 text-amber-700">
        <p className="text-sm">Enjoy your perfectly crafted {style.name}! 🍻</p>
      </div>
    </PageLayout>
  );
}
