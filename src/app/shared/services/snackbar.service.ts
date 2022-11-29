import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) {}

  public open(message: string, duration = 3000) {
    this.snackbar.open(message, undefined, { duration });
  }
}
