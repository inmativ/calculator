import { Injectable } from '@angular/core';

import { map, merge, Observable, shareReplay, startWith, Subject, tap } from 'rxjs';

import { Transaction } from '../models/transaction.model';

@Injectable()
export class TransactionService {
  public readonly storageChange$: Observable<Transaction[]>;

  private readonly _addInitiator$ = new Subject<Transaction>();
  private readonly _removeInitiator$ = new Subject<number>();

  private readonly _storage: Transaction[];

  constructor() {
    this._storage = this._getStorage();
    this.storageChange$ = this._getStorageChange();

    this._observeChange(this.storageChange$);
  }

  public addTransaction(value: Transaction) {
    this._addInitiator$.next(value);
  }

  public remove(id: number) {
    this._removeInitiator$.next(id);
  }

  private _observeChange(change$: Observable<Transaction[]>) {
    change$.subscribe((storage) => {
      const json = JSON.stringify(storage);
      localStorage.setItem('storage', json);
    });
  }

  private _getStorageChange() {
    const add$ = this._addInitiator$.pipe(
      tap((transaction) => this._storage.push(transaction))
    );

    const remove$ = this._removeInitiator$.pipe(
      tap((index) => this._storage.splice(index, 1))
    );

    return merge(add$, remove$).pipe(
      startWith(null),
      map(() => this._storage),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  private _getStorage() {
    const json = localStorage.getItem('storage');
    const storage = JSON.parse(json || '[]');
    return storage;
  }
}
