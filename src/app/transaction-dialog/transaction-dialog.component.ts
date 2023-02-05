import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DaysControlComponent } from '../days-control/days-control.component';
import { NewTransaction, Period, Transaction } from '../models/transaction.model';
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
export class TransactionDialogComponent {
  protected form: FormGroup<Form<NewTransaction>>;

  protected periods: PeriodOptions[] = [
    { title: 'Единоразовая', value: 'single' },
    { title: 'День', value: 'day' },
    { title: 'Неделя', value: 'week' },
    { title: 'Месяц', value: 'month' },
  ];

  constructor(builder: FormBuilder) {
    this.form = this._getForm(builder);
  }

  protected close(type: 'income' | 'expense'): ModalResult {
    const { amount, period, periodConfig } = this.form.value;
    const amountValue = Number(amount) * (type === 'income' ? 1 : -1);

    if (!period || !periodConfig) return;

    return {
      amount: amountValue,
      period: period,
      periodConfig: Array.isArray(periodConfig)
        ? periodConfig
        : periodConfig.toISOString(),
    };
  }

  private _getForm(builder: FormBuilder): FormGroup<Form<NewTransaction>> {
    return builder.group<NewTransaction>({
      amount: null,
      period: 'single',
      periodConfig: null,
    });
  }
}
