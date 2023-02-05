import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { map, Observable, Subject, switchMap } from 'rxjs';

import { TransactionService as TransactionService } from '../services/transaction.service';

import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { ChartData } from '../bar-chart/models/chart-data.model';
import { Transaction } from '../models/transaction.model';
import { DAY } from '../time.constants';
import { ModalResult, TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
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

  private readonly _modalInitiator$ = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _storage: TransactionService
  ) {
    this._observeModal(this._modalInitiator$);

    this.chartData$ = this._storage.storageChange$.pipe(
      map((transactions) => this._getChartData(transactions))
    );
  }

  public addIncome() {
    this._modalInitiator$.next();
  }

  private _observeModal(_modalInitiator$: Subject<void>) {
    _modalInitiator$
      .pipe(
        map(() =>
          this._dialog.open<TransactionDialogComponent, unknown, ModalResult>(
            TransactionDialogComponent
          )
        ),
        switchMap((modal) => modal.afterClosed())
      )
      .subscribe((transaction) => {
        this._storage.addTransaction(transaction);
      });
  }

  private _getChartData(transactions: Transaction[]): ChartData {
    const today = Date.now();
    const dates = Array.from(
      { length: this._dayCount },
      (_, i) => new Date(today + i * DAY)
    );

    const shifts = dates.map((date) => this._getShift(date, transactions));

    let value = 0;
    const values = shifts.map((shift) => (value += shift));

    return { dates, values: values };
  }

  private _getShift(date: Date, transactions: Transaction[]): any {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return transactions.reduce((shift, transaction) => {
      if (!transaction.amount) return shift;

      if (transaction.period === 'month' || transaction.period === 'week') {
        if (
          Array.isArray(transaction.periodConfig) &&
          transaction.periodConfig.includes(day)
        ) {
          const amount = transaction.amount;
          return shift + amount;
        }
      } else if (transaction.period === 'single') {
        const transactionDate = new Date(transaction.periodConfig as string);

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
}
