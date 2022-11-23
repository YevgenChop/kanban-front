import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/abstract/base-form.component';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-new-status',
  templateUrl: './new-status.component.html',
  styleUrls: ['./new-status.component.scss'],
})
export class NewStatusComponent extends BaseFormComponent {
  @Input() boardId!: string;
  constructor(private fb: FormBuilder, private statusService: StatusService) {
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
    });
  }
}
