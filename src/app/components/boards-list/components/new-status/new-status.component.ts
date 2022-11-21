import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { StatusService } from './status.service';

@Component({
  selector: 'app-new-status',
  templateUrl: './new-status.component.html',
  styleUrls: ['./new-status.component.scss'],
})
export class NewStatusComponent extends BaseFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) private boardId: string,
    private fb: FormBuilder,
    private statusService: StatusService,
    private dialogRef: MatDialogRef<NewStatusComponent>
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.statusService.createStatus({
        ...this.componentForm.getRawValue(),
        boardId: this.boardId,
      });
      this.dialogRef.close();
    });
  }
}
