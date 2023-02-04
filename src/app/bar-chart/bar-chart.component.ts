import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarChartComponent {
  @Input()
  public xCount = 30;

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'line'>['data'] = {
    labels: Array(30).fill(1),
    datasets: [{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }],
  };

  public barChartOptions: ChartConfiguration<'line'>['options'] = {};
}
