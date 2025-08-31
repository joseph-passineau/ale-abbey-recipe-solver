import type { Style } from '../types';

export const styles: Style[] = [
  {
    name: 'Light Ale',
    criteria: {
      Flavor: [0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      Colour: [0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      Strength: [0, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      Foam: [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    },
  },
  {
    name: 'Blonde Ale',
    criteria: {
      Flavor: [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      Colour: [0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      Strength: [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      Foam: [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    },
  },
  {
    name: 'Old Ale',
    criteria: {
      Flavor: [0, 0, 1, 2, 2, 2, 1, 1, 0, 0, 0],
      Colour: [0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0],
      Strength: [0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      Foam: [1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
    },
  },
];
