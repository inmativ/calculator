import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { map, Subject, switchMap } from 'rxjs';

import { TransactionService as TransactionService } from '../services/transaction.service';

import { BarChartComponent } from '../bar-chart/bar-chart.component';
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
  private readonly _modalInitiator$ = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _storage: TransactionService
  ) {
    this._modalInitiator$
      .pipe(
        map(() => this._dialog.open(TransactionDialogComponent)),
        switchMap((modal) => modal.afterClosed())
      )
      .subscribe((transaction) => {
        this._storage.addTransaction(transaction);
      });
  }

  public addIncome() {
    this._modalInitiator$.next();
  }
}
