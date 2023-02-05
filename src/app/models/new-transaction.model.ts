import { Period } from '../transaction-dialog/transaction-dialog.component';

export type NewTransaction = {
  amount: null | number;
  period: null | Period;
  periodConfig: null | number[] | Date;
};
