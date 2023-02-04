import {
  NgModule,
} from '@angular/core';
import {
  BrowserModule,
} from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';

import {
  AppComponent,
} from './app.component';
import {
  CalculatorComponent,
} from './calculator/calculator.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, CalculatorComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
