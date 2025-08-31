export enum Outcome {
  Bad = 0,
  Neutral = 1,
  Good = 2,
}

export type Virtue = 'Flavor' | 'Colour' | 'Strength' | 'Foam';

export interface Style {
  name: string;
  criteria: Record<Virtue, number[]>;
}

export interface Ingredient {
  name: string;
  price: number;
  virtues: Record<Virtue, number>;
}

export interface ProblemInput {
  style: Style;
  available: Ingredient[];
  required?: string[];
  maxIngredients: number;
  objective: 'cheapest' | 'fewestIngredients';
  desiredVirtues?: Partial<Record<Virtue, Outcome>>;
  minGoodVirtues?: number;
}

export interface Solution {
  recipe: Record<string, number>;
  totalCost: number;
  virtues: Record<Virtue, Outcome>;
}
