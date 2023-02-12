import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

import { ChartData } from './models/chart-data.model';

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
  public data?: ChartData;

  public minWidth?: number;

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartOptions: ChartConfiguration<'line'>['options'] = {};
}
