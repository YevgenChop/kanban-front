import { Injectable } from '@angular/core';
import { delay, firstValueFrom, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users = [
    {
      id: '1f824ecb-ed90-42c1-ac3c-81dd4b3dead3',
      name: 'wwwwww',
      email: 'lelel10810@sopulit.com',
    },
    {
      id: 'b31a1c0f-530a-4afe-85f6-bb993405ac2f',
      name: 'test',
      email: 'dojoda1467@lidely.com',
    },
  ];
  constructor() {}

  public getUsers(
    term: string
  ): Promise<{ id: string; name: string; email: string }[]> {
    return firstValueFrom(
      of(
        this.users.filter(
          (u) => u.email.includes(term) || u.name.includes(term)
        )
      ).pipe(delay(1000))
    );
  }
}
