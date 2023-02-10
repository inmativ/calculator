import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { map, Observable, Subject, switchMap } from 'rxjs';

import { TransactionService } from '../services/transaction.service';

import { Transaction } from '../models/transaction.model';
import { ModalResult, TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

type TransactionView = Pick<Transaction, 'amount' | 'period' | 'title'> & {
  periodConfig: string;
};

type Id = number | undefined;

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  protected transactions$: Observable<TransactionView[]>;

  private readonly _modalInitiator$ = new Subject<Id>();
  constructor(
    private readonly _storage: TransactionService,
    private readonly _dialog: MatDialog
  ) {
    this._observeModal(this._modalInitiator$);
    this.transactions$ = this._getTransactions(_storage);
  }

  public add() {
    this._modalInitiator$.next(undefined);
  }

  public edit(id: number) {
    this._modalInitiator$.next(id);
  }

  public remove(id: number) {
    this._storage.remove(id);
  }

  private _observeModal(id$: Subject<Id>) {
    id$
      .pipe(switchMap((id) => this._openModal(id)))
      .subscribe((transaction) => {
        this._storage.save(transaction);
      });
  }

  private _openModal(id?: number) {
    const modal = this._dialog.open<
      TransactionDialogComponent,
      Transaction,
      ModalResult
    >(TransactionDialogComponent);

    if (id !== undefined) {
      modal.componentInstance.editedTransaction = this._storage.getById(id);
    }

    return modal.afterClosed();
  }

  private _getTransactions(
    storage: TransactionService
  ): Observable<TransactionView[]> {
    return storage.storageChange$.pipe(
      map((transactions) =>
        transactions.map((item) => {
          const periodConfig = Array.isArray(item.periodConfig)
            ? String(item.periodConfig)
            : this._mapDate(item.periodConfig);

          return { ...item, periodConfig: periodConfig };
        })
      )
    );
  }

  private _mapDate(stringDate: string) {
    const date = new Date(stringDate);
    return `${date.getDate()}`;
  }
}
