import { Injectable, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UiComponent } from './ui-component.component';

@Injectable()
export abstract class BaseFormComponent extends UiComponent implements OnInit {
  public componentForm!: FormGroup;
  public error!: string;
  public isLoading = false;

  abstract setForm(): void;

  ngOnInit(): void {
    this.setForm();
  }

  public async handleSubmit(cb: () => Promise<void>): Promise<void> {
    if (!this.componentForm.valid) return;

    this.componentForm.disable();
    this.error = '';
    this.isLoading = true;

    try {
      await cb();
      this.isLoading = false;
      this.componentForm.reset();
      this.componentForm.enable();
    } catch (error) {
      this.onCatchError(error as string);
    }
  }

  public onCatchError(error: string): void {
    this.error = error;
    this.isLoading = false;
    this.componentForm.enable();
    this.componentForm.markAsUntouched();
  }
}
