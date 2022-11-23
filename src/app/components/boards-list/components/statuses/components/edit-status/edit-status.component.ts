import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.scss'],
})
export class EditStatusComponent extends BaseFormComponent {
  @Input() title!: string;
  @Input() statusId!: string;
  @Input() boardId!: string;
  @Output() updatedEvent = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private statusService: StatusService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: [this.title, Validators.required],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.statusService.updateStatus(this.statusId, {
        boardId: this.boardId,
        ...this.componentForm.getRawValue(),
      });
    });

    if (this.error) {
      return this.openSnackbar(this.error);
    }

    this.openSnackbar('Status updated');
    this.updatedEvent.emit();
  }

  public openSnackbar(message: string): void {
    this.snackbar.open(message, undefined, { duration: 3000 });
  }

  public cancel(): void {
    this.updatedEvent.emit();
  }
}
