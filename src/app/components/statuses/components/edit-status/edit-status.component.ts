import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
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
    private snackbarService: SnackbarService
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
      this.snackbarService.open(this.error);
      return;
    }

    this.updatedEvent.emit();
  }

  public cancel(): void {
    this.updatedEvent.emit();
  }
}
