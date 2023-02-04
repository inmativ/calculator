import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    CommonModule,
    BarChartComponent,
    MatDialogModule,
    TransactionDialogComponent,
  ],
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorComponent {
  constructor(private readonly _dialog: MatDialog) {
    this.addIncome();
  }

  public addIncome() {
    this._dialog.open(TransactionDialogComponent);
  }
}
