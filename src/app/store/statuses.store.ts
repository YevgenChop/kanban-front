import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IStatus } from '../models/status.model';

@Injectable({
  providedIn: 'root',
})
export class StatusesStore {
  public statuses$: BehaviorSubject<IStatus[]> = new BehaviorSubject<IStatus[]>([]);

  public get statuses(): IStatus[] {
    return this.statuses$.getValue();
  }
}
