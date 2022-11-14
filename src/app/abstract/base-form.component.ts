import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export abstract class BaseFormComponent implements OnInit {
  public authForm!: FormGroup;
  public error!: string;
  public isLoading = false;

  abstract setAuthForm(): void;

  ngOnInit(): void {
    this.setAuthForm();
  }

  public async handleSubmit(cb: () => Promise<void>): Promise<void> {
    if (!this.authForm.valid) return;

    this.authForm.disable();
    this.error = '';
    this.isLoading = true;

    try {
      await cb();
      this.isLoading = false;
      this.authForm.reset();
      this.authForm.enable();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  public onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.authForm.enable();
    this.authForm.markAsUntouched();
  }
}
