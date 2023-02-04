import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { DaysControlComponent } from '../days-control/days-control.component';
import { Form } from '../utils/type';

type Period = 'single' | 'day' | 'week' | 'month';

type PeriodOptions = {
  title: string;
  value: Period;
};

type Transaction = {
  amount: null | number;
  period: null | Period;
  periodConfig: null | number[];
  date: null;
};

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
    MatNativeDateModule,
  ],
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionDialogComponent {
  protected form: FormGroup<Form<Transaction>>;

  protected periods: PeriodOptions[] = [
    { title: 'Единоразовая', value: 'single' },
    { title: 'День', value: 'day' },
    { title: 'Неделя', value: 'week' },
    { title: 'Месяц', value: 'month' },
  ];

  constructor(builder: FormBuilder) {
    this.form = this._getForm(builder);

    this.form.valueChanges.subscribe((params) => {
      console.log('params: ', params);
    });
  }

  private _getForm(builder: FormBuilder): FormGroup<Form<Transaction>> {
    return builder.group<Transaction>({
      amount: null,
      period: 'single',
      periodConfig: null,
      date: null,
    });
  }
}
