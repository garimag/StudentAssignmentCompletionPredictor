
export enum CompletionModel {
  LINEAR = 'linearly',
  EXPONENTIAL = 'exponentially',
  SQUARE_ROOT = 'square root function'
}

export interface AppState {
  model: CompletionModel | null;
  numberOfStudents: number;
  numberOfFulfilledStudents: number;
  numberOfDaysLeft: number;
  numberOfTotalDays: number;
}
