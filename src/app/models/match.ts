export interface Match {
  date: Date,
  place?: string,
  players: number[],
  substitutes?: number[],
  teams?: number[][],
  scores?: number[][],
};