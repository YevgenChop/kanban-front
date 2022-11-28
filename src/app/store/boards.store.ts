import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBoardWithUsers } from '../models/board.model';
@Injectable({
  providedIn: 'root',
})
export class BoardsStore {
  public boards$: BehaviorSubject<IBoardWithUsers[]> = new BehaviorSubject<IBoardWithUsers[]>([]);

  public get boards(): IBoardWithUsers[] {
    return this.boards$.getValue();
  }
}
