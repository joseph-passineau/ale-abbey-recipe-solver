import type { Ingredient } from '../types';

export const ingredients: Ingredient[] = [
  {
    name: 'Standard Yeast',
    price: 2,
    virtues: { Flavor: 0.5, Colour: 0, Strength: -1, Foam: -0.5 },
  },
  {
    name: 'Pale Malt',
    price: 1.5,
    virtues: { Flavor: 0.4, Colour: 0.3, Strength: 1, Foam: 0.5 },
  },
  {
    name: 'Gruit',
    price: 2,
    virtues: { Flavor: 0.5, Colour: -0.3, Strength: 0, Foam: 0 },
  },
  {
    name: 'Brown Malt',
    price: 5.5,
    virtues: { Flavor: 1.6, Colour: 2, Strength: 0, Foam: 0 },
  },
];
