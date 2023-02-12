import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { map, Observable } from 'rxjs';

import { TransactionService } from '../services/transaction.service';

import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ChartData } from '../bar-chart/models';
import { Transaction } from '../models/transaction.model';
import { DAY } from '../time.constants';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { TransactionListComponent } from '../transaction-list/transaction-list.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    BarChartComponent,
    MatDialogModule,
    MatButtonModule,
    TransactionDialogComponent,
    TransactionListComponent,
  ],
  providers: [TransactionService],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {
  public chartData$: Observable<ChartData>;

  private readonly _dayCount = 50;

  constructor(private readonly _storage: TransactionService) {
    this.chartData$ = this._storage.storageChange$.pipe(
      map((transactions) => this._getChartData(transactions))
    );
  }

  private _getChartData(transactions: Transaction[]): ChartData {
    const today = Date.now();
    const dates = Array.from(
      { length: this._dayCount },
      (_, i) => new Date(today + i * DAY)
    );

    const shifts = dates.map((date) => this._getShift(date, transactions));

    let amount = this._getInitialAmount(transactions);
    const values = shifts.map((shift) => (amount += shift));

    const withoutVertices = this._reduceVertices(values);

    const allowableSpending = this._getAllowableSpending(withoutVertices);

    let spend = 0;
    const spending = allowableSpending.map((s) => (spend += s));

    const datasets = [
      { label: 'Баланс>', data: values },
      { label: 'Тренд', data: allowableSpending },
      {
        label: 'Сглаженный',
        data: withoutVertices,
      },
      { label: 'Расход', data: spending },
    ].map(({ label, data }) => ({
      label,
      data: data.map((kopek) => kopek / 100),
    }));

    return {
      labels: dates.map((date) => date.getDate()),
      datasets: datasets,
    };
  }

  private _getStartCalculation(transactions: Transaction[]) {
    return transactions.reduce((acc, { date }) => {
      const time = new Date(date).getTime();

      return Math.min(acc, time);
    }, Infinity);
  }

  private _getShift(date: Date, transactions: Transaction[]) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return transactions.reduce((shift, transaction) => {
      if (!transaction.amount) return shift;

      if (transaction.period === 'month' || transaction.period === 'week') {
        if (transaction.periodConfig.includes(day)) {
          const amount = transaction.amount;
          return shift + amount;
        }
      } else if (transaction.period === 'single') {
        const transactionDate = new Date(transaction.date);

        if (
          transactionDate &&
          transactionDate.getDate() === day &&
          transactionDate.getMonth() === month &&
          transactionDate.getFullYear() === year
        ) {
          const amount = transaction.amount;
          return shift + amount;
        }
      }

      return shift;
    }, 0);
  }

  private _getInitialAmount(transactions: Transaction[]) {
    const start = this._getStartCalculation(transactions);
    const today = Date.now();

    let value = 0;
    for (let d = start; d < today; d += DAY) {
      const date = new Date(d);
      value += this._getShift(date, transactions);
    }
    return value;
  }

  private _getAllowableSpending(values: number[]) {
    const l = values.length - 1;
    const accumulated = values[l];
    const initialAmount = 0;

    let dailySpending = (accumulated - initialAmount) / l;

    const allowableSpending: number[] = [];
    for (let i = 0; i < values.length; i++) {
      const cur = values[i];
      const next = values[i + 1] ?? Infinity;

      const spent = dailySpending * i;
      if (cur <= spent && cur < next) {
        const spend = (cur - initialAmount) / i;
        const stepSpending = Array.from({ length: i + 1 }, () => spend);
        allowableSpending.push(...stepSpending);

        dailySpending = (accumulated - cur) / (l - i);
      }
    }

    return allowableSpending;
  }

  private _reduceVertices(values: number[]) {
    const withoutVertices: number[] = [];

    let least = Infinity;
    for (let i = values.length - 1; i >= 0; i--) {
      const cur = values[i];
      withoutVertices[i] = least = Math.min(cur, least);
    }
    return withoutVertices;
  }
}
