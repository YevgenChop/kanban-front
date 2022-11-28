import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  public handleError(error: HttpErrorResponse): Promise<never> {
    let errorMessage = 'An unknown error occured...';

    if (error && error.error.message) {
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message.join(', ')
        : error.error.message;
    }

    return Promise.reject(errorMessage);
  }
}
