declare module 'javascript-lp-solver' {
  export interface SolverResult {
    feasible: boolean;
    result: number;
    bounded?: boolean;
    isIntegral?: boolean;
    [key: string]: number | boolean | undefined;
  }

  export interface SolverVariable {
    [key: string]: number;
  }

  export interface SolverModel {
    optimize: string;
    opType: 'min' | 'max';
    constraints: Record<
      string,
      { '>=': number } | { '<=': number } | { min: number } | { max: number }
    >;
    variables: Record<string, SolverVariable>;
    ints: Record<string, number>;
  }

  export default class Solver {
    static Solve(model: SolverModel): SolverResult;
  }
}
