import { FormControl } from '@angular/forms';

export type Form<T> = {
  [P in keyof T]: FormControl<T[P]>;
};
