import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseFormComponent } from '../../abstract/base-form.component';
import { IUpdateUserData } from '../../models/auth-user.model';
import { AuthUserStore } from '../../store/auth-user.store';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent extends BaseFormComponent {
  public user = this.authUserStore.authUser;

  constructor(
    private fb: FormBuilder,
    private authUserStore: AuthUserStore,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group(
      {
        name: [this.user?.name, [Validators.required]],
        email: [this.user?.email, [Validators.required, Validators.email]],
        login: [this.user?.login, Validators.required],
        password: ['', [Validators.minLength(6)]],
      },
      { updateOn: 'submit' }
    );
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(
      async () => {
        await this.userService.updateUser(this.getDataForSubmit());
        this.openSnackbar();
      },
      { reset: false }
    );
  }

  private openSnackbar(): void {
    this.snackbar.open('Your data has been updated', undefined, {
      duration: 3000,
    });
  }

  private getDataForSubmit(): IUpdateUserData {
    const rawData = this.componentForm.getRawValue();
    const updateData = {} as IUpdateUserData;

    for (const property in rawData) {
      const prop = property as keyof IUpdateUserData;
      if (rawData[prop]) {
        updateData[prop] = rawData[prop];
      }
    }
    return updateData;
  }
}
