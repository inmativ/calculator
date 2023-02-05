import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

import { TypedChanges } from '../utils/type/typed-changes.util';
import { ChartData } from './models/chart-data.model';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent implements OnChanges {
  @Input()
  public data?: ChartData;

  public minWidth?: number;

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData?: ChartConfiguration<'line'>['data'];

  public barChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      y: {
        stacked: 'single',
      },
    },
  };

  ngOnChanges(changes: TypedChanges<this>): void {
    const value = changes.data?.currentValue;

    if (value) {
      const { dates, values: data = [] } = value;

      this.barChartData = {
        labels: dates.map((date) => date.getDate()),
        datasets: [{ data, label: 'Баланс' }],
      };

      this.minWidth = 20 * dates.length;
    }
  }
}
