import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DaysControlComponent } from '../days-control/days-control.component';
import {
  NewTransaction,
  Period,
  Transaction,
} from '../models/transaction.model';
import { Form } from '../utils/type';

type PeriodOptions = {
  title: string;
  value: Period;
};

export type ModalResult = Transaction | undefined;

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    DaysControlComponent,
    MatDatepickerModule,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDialogComponent implements OnInit {
  @Input()
  public editedTransaction?: Transaction;

  protected form: FormGroup<Form<NewTransaction>>;

  protected periods: PeriodOptions[] = [
    { title: 'Единоразовая', value: 'single' },
    { title: 'День', value: 'day' },
    { title: 'Неделя', value: 'week' },
    { title: 'Месяц', value: 'month' },
  ];

  constructor(
    private readonly _dialogRef: MatDialogRef<TransactionDialogComponent>,
    builder: FormBuilder
  ) {
    this.form = this._getForm(builder);
  }

  ngOnInit(): void {
    if (this.editedTransaction) {
      const { date, ...other } = this.editedTransaction;
      this.form.setValue({ date: new Date(date), ...other, title: '' });
    }
  }

  protected close(type: 'income' | 'expense') {
    const { amount, periodConfig, date, ...other } = this.form.getRawValue();
    const amountValue = Number(amount) * (type === 'income' ? 1 : -1);

    if (this.form.invalid) return;

    this._dialogRef.close({
      id: this.editedTransaction?.id,
      amount: amountValue,
      date: date.toISOString(),
      periodConfig,
      ...other,
    });
  }

  private _getForm(builder: FormBuilder): FormGroup<Form<NewTransaction>> {
    const group = builder.nonNullable.group({
      title: '',
      amount: 0,
      date: new Date(),
      period: 'single' as Period,
      periodConfig: [[]] as number[][],
    });

    return group;
  }
}
