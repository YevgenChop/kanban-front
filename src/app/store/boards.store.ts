import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBoard } from '../models/board.model';
@Injectable({
  providedIn: 'root',
})
export class BoardsStore {
  public boards$: BehaviorSubject<IBoard[]> = new BehaviorSubject<IBoard[]>([]);

  public get boards(): IBoard[] {
    return this.boards$.getValue();
  }
}
