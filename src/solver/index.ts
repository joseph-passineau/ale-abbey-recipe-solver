import Solver, {
  type SolverModel,
  type SolverResult,
} from 'javascript-lp-solver';
import {
  type Ingredient,
  type ProblemInput,
  type Solution,
  type Virtue,
  Outcome,
} from '../types';

interface SolverModelBuilder {
  model: SolverModel;
  availableIngredients: Ingredient[];
}

export class RecipeSolver {
  static solve(input: ProblemInput): Solution | null {
    const { minGoodVirtues } = input;

    if (minGoodVirtues && minGoodVirtues > 0) {
      return this.solveWithMinGoodVirtues(input);
    }

    return this.solveSingleModel(input);
  }

  private static solveSingleModel(input: ProblemInput): Solution | null {
    const { available, required } = input;

    // Validate that all required ingredients are available
    if (required && required.length > 0) {
      const availableNames = available.map(ing => ing.name);
      const missingRequired = required.filter(
        req => !availableNames.includes(req)
      );
      if (missingRequired.length > 0) {
        // Required ingredients are not available
        return null;
      }
    }

    const builder = this.buildModel(input);
    if (!builder) {
      // Constraints couldn't be satisfied (e.g., impossible virtue requirements)
      return null;
    }

    const result = Solver.Solve(builder.model);

    if (!result.feasible) {
      return null;
    }

    return this.extractSolution(
      result,
      builder.availableIngredients,
      input.style
    );
  }

  private static buildModel(input: ProblemInput): SolverModelBuilder | null {
    const { available, objective } = input;

    const model: SolverModel = {
      optimize: objective === 'cheapest' ? 'cost' : 'count',
      opType: 'min',
      constraints: {},
      variables: {},
      ints: {},
    };

    this.addVariables(model, available);
    this.addBasicConstraints(model, available, input);
    const constraintsAdded = this.addVirtueConstraints(model, available, input);

    if (!constraintsAdded) {
      // Virtue constraints couldn't be satisfied
      return null;
    }

    return { model, availableIngredients: available };
  }

  private static addVariables(
    model: SolverModel,
    ingredients: Ingredient[]
  ): void {
    ingredients.forEach(ingredient => {
      model.variables[ingredient.name] = {
        cost: ingredient.price,
        count: 1,
      };
      model.ints[ingredient.name] = 1;
    });
  }

  private static addBasicConstraints(
    model: SolverModel,
    ingredients: Ingredient[],
    input: ProblemInput
  ): void {
    const { maxIngredients, required = [] } = input;

    model.constraints.maxIngredients = { max: maxIngredients };
    model.constraints.minOneIngredient = { min: 1 };

    ingredients.forEach(ingredient => {
      model.variables[ingredient.name].maxIngredients = 1;
      model.variables[ingredient.name].minOneIngredient = 1;
    });

    this.addRequiredConstraints(model, ingredients, required);
  }

  private static addRequiredConstraints(
    model: SolverModel,
    ingredients: Ingredient[],
    required: string[]
  ): void {
    required.forEach(ingredientName => {
      const ingredient = ingredients.find(ing => ing.name === ingredientName);
      if (!ingredient) return;

      const constraintName = `${ingredientName}_required`;
      model.constraints[constraintName] = { min: 1 };

      ingredients.forEach(ing => {
        if (ing.name === ingredientName) {
          model.variables[ing.name][constraintName] = 1;
        }
      });
    });
  }

  private static addVirtueConstraints(
    model: SolverModel,
    ingredients: Ingredient[],
    input: ProblemInput
  ): boolean {
    const { desiredVirtues, style } = input;
    if (!desiredVirtues) return true;

    for (const [virtue, targetOutcome] of Object.entries(desiredVirtues)) {
      const virtueKey = virtue as Virtue;
      const validBins = this.findValidBins(
        style.criteria[virtueKey],
        targetOutcome
      );

      if (validBins.length === 0) {
        // If any virtue has no valid bins for the requested outcome,
        // it's impossible to satisfy the constraints
        return false;
      }

      this.addVirtueRangeConstraints(
        model,
        ingredients,
        virtue,
        virtueKey,
        validBins,
        targetOutcome
      );
    }
    return true;
  }

  private static findValidBins(
    criteria: number[],
    targetOutcome: Outcome
  ): number[] {
    const result = criteria
      .map((outcome, index) => ({ index, outcome }))
      .filter(bin => bin.outcome === targetOutcome)
      .map(bin => bin.index);

    return result;
  }

  private static addVirtueRangeConstraints(
    model: SolverModel,
    ingredients: Ingredient[],
    virtue: string,
    virtueKey: Virtue,
    validBins: number[],
    targetOutcome: Outcome
  ): void {
    if (validBins.length === 0) return;

    const sortedBins = [...validBins].sort((a, b) => a - b);

    // Different strategies based on the target outcome
    let minBin: number, maxBin: number;

    if (targetOutcome === Outcome.Bad) {
      // For Bad: be very restrictive, only allow the first valid bin to avoid problematic ranges
      minBin = sortedBins[0];
      maxBin = sortedBins[0] + 0.99;
    } else if (targetOutcome === Outcome.Neutral) {
      // For Neutral: be restrictive but allow more flexibility
      minBin = sortedBins[0];
      maxBin = sortedBins[0] + 0.99; // Could expand this if needed
    } else {
      // For Good: be less restrictive, allow all valid bins
      minBin = Math.min(...validBins);
      maxBin = Math.max(...validBins) + 0.99;
    }

    model.constraints[`${virtue}Min`] = { min: minBin };
    model.constraints[`${virtue}Max`] = { max: maxBin };

    ingredients.forEach(ingredient => {
      const coefficient = ingredient.virtues[virtueKey];
      if (coefficient !== 0) {
        model.variables[ingredient.name][`${virtue}Min`] = coefficient;
        model.variables[ingredient.name][`${virtue}Max`] = coefficient;
      }
    });
  }

  private static extractSolution(
    result: SolverResult,
    ingredients: Ingredient[],
    style: { criteria: Record<Virtue, number[]> }
  ): Solution {
    const recipe: Record<string, number> = {};
    let totalCost = 0;

    ingredients.forEach(ingredient => {
      const quantity = result[ingredient.name];
      if (typeof quantity === 'number' && quantity > 0) {
        const roundedQuantity = Math.round(quantity);
        recipe[ingredient.name] = roundedQuantity;
        totalCost += roundedQuantity * ingredient.price;
      }
    });

    const virtues = this.calculateVirtues(recipe, ingredients, style);

    return {
      recipe,
      totalCost: Math.round(totalCost * 100) / 100,
      virtues,
    };
  }

  private static solveWithMinGoodVirtues(input: ProblemInput): Solution | null {
    const { available, required } = input;

    // Validate that all required ingredients are available
    if (required && required.length > 0) {
      const availableNames = available.map(ing => ing.name);
      const missingRequired = required.filter(
        req => !availableNames.includes(req)
      );
      if (missingRequired.length > 0) {
        // Required ingredients are not available
        return null;
      }
    }

    const { minGoodVirtues } = input;
    if (!minGoodVirtues || minGoodVirtues <= 0) {
      return this.solveSingleModel(input);
    }

    const virtues: Virtue[] = ['Flavor', 'Colour', 'Strength', 'Foam'];
    const combinations = this.generateCombinations(virtues, minGoodVirtues);

    let bestSolution: Solution | null = null;

    for (const combination of combinations) {
      const solution = this.tryCombination(input, combination);
      if (
        solution &&
        this.isBetterSolution(solution, bestSolution, input.objective)
      ) {
        bestSolution = solution;
      }
    }

    return bestSolution;
  }

  private static tryCombination(
    input: ProblemInput,
    virtues: Virtue[]
  ): Solution | null {
    const modifiedInput = {
      ...input,
      desiredVirtues: {
        ...input.desiredVirtues,
        ...Object.fromEntries(virtues.map(virtue => [virtue, Outcome.Good])),
      },
      minGoodVirtues: undefined,
    };

    const solution = this.solveSingleModel(modifiedInput);
    if (!solution) return null;

    const goodVirtueCount = Object.values(solution.virtues).filter(
      virtue => virtue === Outcome.Good
    ).length;

    return goodVirtueCount >= (input.minGoodVirtues || 0) ? solution : null;
  }

  private static isBetterSolution(
    solution: Solution,
    bestSolution: Solution | null,
    objective: string
  ): boolean {
    if (!bestSolution) return true;

    if (objective === 'cheapest') {
      return solution.totalCost < bestSolution.totalCost;
    }

    return (
      Object.keys(solution.recipe).length <
      Object.keys(bestSolution.recipe).length
    );
  }

  private static generateCombinations<T>(array: T[], size: number): T[][] {
    if (size > array.length || size === 0) return [];
    if (size === array.length) return [array];

    const result: T[][] = [];

    const combine = (start: number, current: T[]) => {
      if (current.length === size) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        current.push(array[i]);
        combine(i + 1, current);
        current.pop();
      }
    };

    combine(0, []);
    return result;
  }

  private static calculateVirtues(
    recipe: Record<string, number>,
    ingredients: Ingredient[],
    style: { criteria: Record<Virtue, number[]> }
  ): Record<Virtue, Outcome> {
    const rawVirtues = this.calculateRawVirtues(recipe, ingredients);
    return this.mapVirtuesToOutcomes(rawVirtues, style.criteria);
  }

  private static calculateRawVirtues(
    recipe: Record<string, number>,
    ingredients: Ingredient[]
  ): Record<Virtue, number> {
    const rawVirtues: Record<Virtue, number> = {
      Flavor: 0,
      Colour: 0,
      Strength: 0,
      Foam: 0,
    };

    Object.entries(recipe).forEach(([ingredientName, quantity]) => {
      const ingredient = ingredients.find(ing => ing.name === ingredientName);
      if (!ingredient) return;

      Object.entries(ingredient.virtues).forEach(([virtue, value]) => {
        rawVirtues[virtue as Virtue] += value * quantity;
      });
    });

    return rawVirtues;
  }

  private static mapVirtuesToOutcomes(
    rawVirtues: Record<Virtue, number>,
    criteria: Record<Virtue, number[]>
  ): Record<Virtue, Outcome> {
    const outcomes: Record<Virtue, Outcome> = {} as Record<Virtue, Outcome>;

    Object.entries(rawVirtues).forEach(([virtue, value]) => {
      const idx = Math.min(10, Math.max(0, Math.floor(value)));
      outcomes[virtue as Virtue] = criteria[virtue as Virtue][idx] as Outcome;
    });

    return outcomes;
  }
}
