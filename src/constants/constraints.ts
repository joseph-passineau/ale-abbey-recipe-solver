export const DEFAULT_CONSTRAINTS = {
  maxIngredients: 25,
  objective: 'cheapest' as const,
  minGoodVirtues: 4,
  virtueRequirements: {
    Flavor: 'Good' as const,
    Color: 'Good' as const,
    Strength: 'Good' as const,
    Foam: 'Good' as const,
  },
  requiredIngredients: [] as string[],
};

export const CONSTRAINT_LIMITS = {
  maxIngredients: {
    min: 5,
    max: 50,
    step: 5,
  },
  minGoodVirtues: {
    min: 0,
    max: 4,
    step: 1,
  },
};
