import { useState } from 'react';
import { RecipeSolver } from '../solver';
import type { Ingredient, Solution, Style } from '../types';
import { Outcome } from '../types';

interface VirtueRequirements {
  Flavor: keyof typeof Outcome;
  Color: keyof typeof Outcome;
  Strength: keyof typeof Outcome;
  Foam: keyof typeof Outcome;
}

interface Constraints {
  maxIngredients: number;
  objective: 'cheapest' | 'fewestIngredients';
  minGoodVirtues: number;
  virtueRequirements: VirtueRequirements;
  requiredIngredients: string[];
}

export function useRecipeSolver() {
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const solveRecipe = async (
    style: Style,
    ingredients: Ingredient[],
    selectedIngredients: string[],
    constraints: Constraints
  ) => {
    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const availableIngredients = ingredients.filter(ing =>
        selectedIngredients.includes(ing.name)
      );

      const desiredVirtues = {
        Flavor: Outcome[constraints.virtueRequirements.Flavor],
        Colour: Outcome[constraints.virtueRequirements.Color],
        Strength: Outcome[constraints.virtueRequirements.Strength],
        Foam: Outcome[constraints.virtueRequirements.Foam],
      };

      const result = RecipeSolver.solve({
        style,
        available: availableIngredients,
        required: constraints.requiredIngredients,
        maxIngredients: constraints.maxIngredients,
        objective: constraints.objective,
        minGoodVirtues: constraints.minGoodVirtues,
        desiredVirtues,
      });

      if (result) {
        setSolution(result);
      } else {
        setError(
          'No valid recipe found with the selected ingredients and constraints. Try adjusting your requirements or adding more ingredients.'
        );
      }
    } catch {
      setError('An error occurred while solving the recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setSolution(null);
    setError(null);
  };

  return {
    loading,
    solution,
    error,
    solveRecipe,
    reset,
  };
}
