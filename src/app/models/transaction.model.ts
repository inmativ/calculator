export type Period = 'single' | 'day' | 'week' | 'month';

export type NewTransaction = {
  title: string;
  amount: number;
  date: Date;
  period: Period;
  periodConfig: number[];
};

export type Transaction = {
  id?: number;
  title: string;
  amount: number;
  period: Period;
  date: string;
  periodConfig: number[];
};
