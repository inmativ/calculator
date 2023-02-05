export type Period = 'single' | 'day' | 'week' | 'month';

export type NewTransaction = {
  amount: null | number;
  period: null | Period;
  periodConfig: null | Date | number[];
};

export type Transaction = {
  amount: number;
  period: Period;
  periodConfig: string | number[];
};
