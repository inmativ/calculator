import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Observable } from 'rxjs';

import { TransactionService } from '../services/transaction.service';

import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  protected transactions$: Observable<Transaction[]>;

  constructor(private readonly storage: TransactionService) {
    this.transactions$ = storage.storageChange$;
  }

  public remove(id: number) {
    this.storage.remove(id);
  }
}
