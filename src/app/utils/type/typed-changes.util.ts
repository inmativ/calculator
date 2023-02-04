import { SimpleChange } from '@angular/core';

interface TypedChange<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
}
type Defined<T> = T extends undefined ? never : T;

export type TypedChanges<T> = {
  [K in keyof T]?: TypedChange<Defined<T[K]>>;
} & {
  [key: string]: SimpleChange;
};
