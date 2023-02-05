import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { map, Observable } from 'rxjs';

import { TransactionService } from '../services/transaction.service';

import { Transaction } from '../models/transaction.model';

type TransactionView = Pick<Transaction, 'amount' | 'period'> & {
  periodConfig: string;
};

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

  constructor(private readonly storage: TransactionService) {
    this.transactions$ = storage.storageChange$.pipe(
      map((transactions) => {
        return transactions.map((item) => {
          const periodConfig = Array.isArray(item.periodConfig)
            ? String(item.periodConfig)
            : this._mapDate(item.periodConfig);

          return { ...item, periodConfig: periodConfig };
        });
      })
    );
  }

  private _mapDate(stringDate: string) {
    const date = new Date(stringDate);
    return `${date.getDate()}`;
  }

  public remove(id: number) {
    this.storage.remove(id);
  }
}
