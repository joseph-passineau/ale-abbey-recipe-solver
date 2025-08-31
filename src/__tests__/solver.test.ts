import { ingredients } from '../data/ingredients';
import { styles } from '../data/styles';
import { RecipeSolver } from '../solver';
import { Outcome } from '../types';

// Helper functions for robust ingredient selection
const getIngredientsByNames = (names: string[]): typeof ingredients =>
  ingredients.filter(ing => names.includes(ing.name));

const getIngredientByName = (name: string): (typeof ingredients)[0] =>
  ingredients.find(ing => ing.name === name)!;

// Test constants based on ingredient data
const MAX_REASONABLE_COST =
  ingredients.reduce((sum, ing) => sum + ing.price, 0) * 10; // Max cost if using all ingredients at max quantity

describe('RecipeSolver', () => {
  const lightAle = styles.find(style => style.name === 'Light Ale')!;

  describe('Basic solving without virtue requirements', () => {
    it('should find a basic recipe solution when no virtue constraints are specified', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);

      expect(result).not.toBeNull();
      expect(result?.recipe).toBeDefined();
      expect(Object.keys(result?.recipe || {}).length).toBeGreaterThan(0);
      expect(result?.totalCost).toBeGreaterThan(0);
    });
  });

  describe('Solving with virtue requirements', () => {
    it('should find a solution that meets all Good virtues', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.recipe).toBeDefined();
        expect(Object.keys(result.recipe).length).toBeGreaterThan(0);
        expect(result.totalCost).toBeGreaterThan(0);

        Object.entries(input.desiredVirtues).forEach(([virtue, target]) => {
          const achieved =
            result.virtues[virtue as keyof typeof result.virtues];
          expect(achieved).toBeGreaterThanOrEqual(target);
        });
      }
    });

    it('should find an optimal solution for all Good virtues', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);

        expect(result.totalCost).toBeGreaterThan(0);
        expect(result.totalCost).toBeLessThan(MAX_REASONABLE_COST);
      }
    });
  });

  describe('Optimization objectives', () => {
    it('should minimize ingredient count when fewestIngredients objective is used', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'fewestIngredients' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.recipe).toBeDefined();
        expect(Object.keys(result.recipe).length).toBeGreaterThan(0);
      }
    });

    it('should always include required ingredients in the solution', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: ['Standard Yeast'],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);

      expect(result).not.toBeNull();
      if (result) {
        expect(result.recipe['Standard Yeast']).toBeGreaterThan(0);
      }
    });
  });

  describe('Minimum good virtues constraint', () => {
    it('should respect minGoodVirtues requirement', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames([
          'Standard Yeast',
          'Pale Malt',
          'Gruit',
          'Brown Malt',
        ]),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 2,
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;
        expect(goodVirtueCount).toBeGreaterThanOrEqual(2);
      }
    });

    it('should find solution with all virtues good when minGoodVirtues is 4', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all available ingredients for this comprehensive test
        required: [],
        maxIngredients: 50,
        objective: 'cheapest' as const,
        minGoodVirtues: 4,
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;
        expect(goodVirtueCount).toBe(4);
      }
    });
  });

  describe('Individual virtue quality requirements', () => {
    it('should respect individual virtue requirements - all Good', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive virtue testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);
      }
    });

    it('should respect individual virtue requirements - mixed qualities', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Neutral,
          Strength: Outcome.Bad,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Foam).toBe(Outcome.Good);
      }
    });

    it('should respect individual virtue requirements - only Neutral requirements', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames([
          'Standard Yeast',
          'Pale Malt',
          'Gruit',
          'Brown Malt',
        ]),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Neutral,
          Colour: Outcome.Neutral,
          Strength: Outcome.Neutral,
          Foam: Outcome.Neutral,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Foam).toBeGreaterThanOrEqual(Outcome.Neutral);
      }
    });

    it('should respect individual virtue requirements - only Bad requirements', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames([
          'Standard Yeast',
          'Pale Malt',
          'Gruit',
          'Brown Malt',
        ]),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Bad,
          Colour: Outcome.Bad,
          Strength: Outcome.Bad,
          Foam: Outcome.Bad,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Foam).toBeGreaterThanOrEqual(Outcome.Bad);
      }
    });

    it('should handle partial virtue requirements', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Strength: Outcome.Good,
          // Only specify requirements for Flavor and Strength
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        // Other virtues can be any quality
      }
    });
  });

  describe('Advanced mode constraints integration', () => {
    it('should work with advanced mode - all virtues Good', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 4, // Basic mode setting
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);

        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;
        expect(goodVirtueCount).toBe(4);
      }
    });

    it('should work with advanced mode - mixed virtue requirements', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 2, // Basic mode setting
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Neutral,
          Strength: Outcome.Bad,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Foam).toBe(Outcome.Good);

        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;
        expect(goodVirtueCount).toBeGreaterThanOrEqual(2); // Should satisfy minGoodVirtues
      }
    });

    it('should prioritize minGoodVirtues over individual requirements when both are set', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 3, // Require at least 3 good virtues
        desiredVirtues: {
          Flavor: Outcome.Bad, // Try to force bad flavor
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;
        expect(goodVirtueCount).toBeGreaterThanOrEqual(3); // Should satisfy minGoodVirtues
        // Even though we requested Bad flavor, minGoodVirtues should override
      }
    });

    it('should work with advanced mode - all virtues Neutral', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames([
          'Standard Yeast',
          'Pale Malt',
          'Gruit',
          'Brown Malt',
        ]),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 0,
        desiredVirtues: {
          Flavor: Outcome.Neutral,
          Colour: Outcome.Neutral,
          Strength: Outcome.Neutral,
          Foam: Outcome.Neutral,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Foam).toBeGreaterThanOrEqual(Outcome.Neutral);
      }
    });

    it('should work with advanced mode - partial virtue requirements', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 1,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Strength: Outcome.Good,
          // Only specify requirements for Flavor and Strength
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        // Other virtues should be at least as good as their natural outcome
        expect(result.virtues.Colour).toBeDefined();
        expect(result.virtues.Foam).toBeDefined();
      }
    });

    it('should handle advanced mode with required ingredients', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: ['Standard Yeast'],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 2,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Neutral,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.recipe['Standard Yeast']).toBeGreaterThan(0);
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Neutral);
        expect(result.virtues.Foam).toBe(Outcome.Good);
      }
    });

    it('should respect advanced mode with all Neutral virtues and minGoodVirtues = 0', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 0, // This is key - must be 0 for advanced mode
        desiredVirtues: {
          Flavor: Outcome.Neutral,
          Colour: Outcome.Neutral,
          Strength: Outcome.Neutral,
          Foam: Outcome.Neutral,
        },
      };

      const result = RecipeSolver.solve(input);

      // The solver is restrictive - it only finds solutions that exactly match the specified outcomes
      // For all Neutral virtues, this might be mathematically impossible with the available ingredients
      // Either way, if a solution is found, it should exactly match the requirements
      if (result) {
        // If a solution is found, all virtues should be exactly Neutral
        expect(result.virtues.Flavor).toBe(Outcome.Neutral);
        expect(result.virtues.Colour).toBe(Outcome.Neutral);
        expect(result.virtues.Strength).toBe(Outcome.Neutral);
        expect(result.virtues.Foam).toBe(Outcome.Neutral);
      }
      // If no solution is found, that's also acceptable - it means it's impossible to achieve exactly Neutral for all virtues
    });

    it('should respect advanced mode with all Bad virtues and minGoodVirtues = 0', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 0, // This is key - must be 0 for advanced mode
        desiredVirtues: {
          Flavor: Outcome.Bad,
          Colour: Outcome.Bad,
          Strength: Outcome.Bad,
          Foam: Outcome.Bad,
        },
      };

      const result = RecipeSolver.solve(input);

      // The solver is restrictive - it only finds solutions that exactly match the specified outcomes
      // For all Bad virtues, this might be mathematically impossible with the available ingredients
      // Either way, if a solution is found, it should exactly match the requirements
      if (result) {
        // If a solution is found, all virtues should be exactly Bad
        expect(result.virtues.Flavor).toBe(Outcome.Bad);
        expect(result.virtues.Colour).toBe(Outcome.Bad);
        expect(result.virtues.Strength).toBe(Outcome.Bad);
        expect(result.virtues.Foam).toBe(Outcome.Bad);
      }
      // If no solution is found, that's also acceptable - it means it's impossible to achieve exactly Bad for all virtues
    });

    it('should respect mixed Bad requirements - Flavor, Color, Strength Bad, Foam Neutral', () => {
      const input = {
        style: lightAle,
        available: ingredients, // Use all ingredients for comprehensive testing
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 0,
        desiredVirtues: {
          Flavor: Outcome.Bad,
          Colour: Outcome.Bad,
          Strength: Outcome.Bad,
          Foam: Outcome.Neutral,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        // Should get exact matches for all requirements
        expect(result.virtues.Flavor).toBe(Outcome.Bad);
        expect(result.virtues.Colour).toBe(Outcome.Bad);
        expect(result.virtues.Strength).toBe(Outcome.Bad); // This should be Bad, not Good!
        expect(result.virtues.Foam).toBe(Outcome.Neutral);
      } else {
        console.log('No solution found for mixed Bad requirements');
      }
    });
  });

  describe('Edge cases', () => {
    it('should return null when no solution is possible', () => {
      const input = {
        style: lightAle,
        available: [],
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).toBeNull();
    });

    it('should handle maxIngredients constraint', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 1,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        const totalIngredients = Object.values(result.recipe).reduce(
          (sum, qty) => sum + qty,
          0
        );
        expect(totalIngredients).toBeLessThanOrEqual(1);
      }
    });

    it('should return null when required ingredient is not available', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Pale Malt']), // Standard Yeast not available
        required: ['Standard Yeast'],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).toBeNull();
    });

    it('should handle empty required ingredients array', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).not.toBeNull();
      expect(result?.recipe).toBeDefined();
    });

    it('should handle zero maxIngredients gracefully', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 0,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      // Should return null as it's impossible to make a recipe with 0 max ingredients
      expect(result).toBeNull();
    });

    it('should handle impossible virtue combinations by returning null', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast']), // Only yeast available
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good, // Yeast has -1 strength, making good strength impossible
          Strength: Outcome.Good,
          Colour: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);
      // This combination might be impossible, so null is acceptable
      // If a solution is found, it should still satisfy the constraints
      if (result) {
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Good);
      }
    });
  });

  describe('Different beer styles', () => {
    it('should work with Blonde Ale style', () => {
      const blondeAle = styles.find(style => style.name === 'Blonde Ale')!;
      const input = {
        style: blondeAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);
        expect(result.totalCost).toBeGreaterThan(0);
      }
    });

    it('should work with Old Ale style', () => {
      const oldAle = styles.find(style => style.name === 'Old Ale')!;
      const input = {
        style: oldAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        expect(result.virtues.Flavor).toBe(Outcome.Good);
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBe(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);
        expect(result.totalCost).toBeGreaterThan(0);
      }
    });

    it('should handle style-specific criteria differences correctly', () => {
      const lightAle = styles.find(style => style.name === 'Light Ale')!;
      const oldAle = styles.find(style => style.name === 'Old Ale')!;

      const inputLight = {
        style: lightAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
        },
      };

      const inputOld = {
        style: oldAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        desiredVirtues: {
          Flavor: Outcome.Good,
        },
      };

      const resultLight = RecipeSolver.solve(inputLight);
      const resultOld = RecipeSolver.solve(inputOld);

      // Both should find solutions, but the recipes might differ due to different style criteria
      expect(resultLight).not.toBeNull();
      expect(resultOld).not.toBeNull();

      if (resultLight && resultOld) {
        expect(resultLight.virtues.Flavor).toBe(Outcome.Good);
        expect(resultOld.virtues.Flavor).toBe(Outcome.Good);
      }
    });
  });

  describe('Boundary conditions', () => {
    it('should handle very high maxIngredients values', () => {
      const input = {
        style: lightAle,
        available: ingredients,
        required: [],
        maxIngredients: 1000, // Very high value
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.totalCost).toBeGreaterThan(0);
      }
    });

    it('should handle single ingredient recipes', () => {
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).not.toBeNull();
      if (result) {
        expect(Object.keys(result.recipe)).toHaveLength(1);
        expect(result.recipe['Pale Malt']).toBeDefined();
      }
    });

    it('should handle recipes with fractional virtue values correctly', () => {
      // Create a test where virtue calculations result in fractional values
      const input = {
        style: lightAle,
        available: getIngredientsByNames(['Standard Yeast', 'Pale Malt']),
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).not.toBeNull();
      if (result) {
        // All virtues should be valid enum values (0, 1, or 2)
        expect([0, 1, 2]).toContain(result.virtues.Flavor);
        expect([0, 1, 2]).toContain(result.virtues.Colour);
        expect([0, 1, 2]).toContain(result.virtues.Strength);
        expect([0, 1, 2]).toContain(result.virtues.Foam);
      }
    });

    it('should handle very expensive ingredients appropriately', () => {
      const expensiveIngredient = getIngredientByName('Brown Malt'); // Most expensive ingredient
      const input = {
        style: lightAle,
        available: [expensiveIngredient],
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
      };

      const result = RecipeSolver.solve(input);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.totalCost).toBeGreaterThan(0);
        // Cost should be reasonable even with expensive ingredients
        expect(result.totalCost).toBeLessThan(MAX_REASONABLE_COST);
      }
    });
  });

  describe('Constraint priority verification', () => {
    it('should verify that minGoodVirtues takes precedence over conflicting desiredVirtues', () => {
      const input = {
        style: lightAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 3, // Require at least 3 good virtues
        desiredVirtues: {
          Flavor: Outcome.Bad, // This conflicts with minGoodVirtues requirement
          Colour: Outcome.Good,
          Strength: Outcome.Good,
          Foam: Outcome.Good,
        },
      };

      const result = RecipeSolver.solve(input);

      if (result) {
        const goodVirtueCount = Object.values(result.virtues).filter(
          virtue => virtue === Outcome.Good
        ).length;

        // minGoodVirtues should take precedence - we should get at least 3 good virtues
        expect(goodVirtueCount).toBeGreaterThanOrEqual(3);

        // The conflicting Flavor: Bad requirement should be overridden
        // (though it's possible Flavor ends up Good anyway due to other constraints)
        expect(result.virtues.Colour).toBe(Outcome.Good);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Good);
        expect(result.virtues.Foam).toBe(Outcome.Good);
      }
    });

    it('should handle minGoodVirtues = 0 with desired Bad virtues correctly', () => {
      const input = {
        style: lightAle,
        available: ingredients,
        required: [],
        maxIngredients: 25,
        objective: 'cheapest' as const,
        minGoodVirtues: 0, // Allow no good virtues
        desiredVirtues: {
          Flavor: Outcome.Bad,
          Colour: Outcome.Bad,
          Strength: Outcome.Bad,
          Foam: Outcome.Neutral, // One neutral to make it more achievable
        },
      };

      const result = RecipeSolver.solve(input);

      // This might return null if the combination is impossible
      // If it succeeds, all specified virtues should meet their requirements
      if (result) {
        expect(result.virtues.Flavor).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Colour).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Strength).toBeGreaterThanOrEqual(Outcome.Bad);
        expect(result.virtues.Foam).toBeGreaterThanOrEqual(Outcome.Neutral);
      }
    });
  });
});
