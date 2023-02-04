import { MatChipListboxChange, MatChipsModule } from '@angular/material/chips';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypedChanges } from '../utils/type/typed-changes.util';
import { ChildActivationEnd } from '@angular/router';

export const DaysControlProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DaysControlComponent),
  multi: true,
};

type Day = {
  title: number;
};

@Component({
  selector: 'app-days-control',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  providers: [DaysControlProvider],
  templateUrl: './days-control.component.html',
  styleUrls: ['./days-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysControlComponent implements ControlValueAccessor, OnChanges {
  @Input()
  public type: 'week' | 'month' = 'week';

  protected days: Day[] = [];

  protected value: string[] = [];

  ngOnChanges(changes: TypedChanges<this>): void {
    if (changes['type']) {
      const count = 7;
      this.days =
        changes['type'].currentValue === 'week'
          ? this._getWeeks(count)
          : this._getWeeks(28);
    }
  }

  changeSelected(event: MatChipListboxChange) {
    const value = event.value.map((val: string) => Number(val));

    this._onChange?.(value);
  }

  private _getWeeks(count: number): Day[] {
    return Array.from({ length: count }, (_, i) => ({ title: i + 1 }));
  }

  writeValue(value: null | number[]) {
    if (!value) return;

    this.value = value.map((val) => String(val));
  }

  _onChange?: (value: number[]) => void;
  registerOnChange(fn: (value: number[]) => void): void {
    this._onChange = fn;
  }

  _onTouched?: () => void;
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
}
