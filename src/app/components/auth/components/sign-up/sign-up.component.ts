import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../auth.component.scss'],
})
export class SignUpComponent extends BaseFormComponent {
  public signedUp = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    super();
  }

  public setForm(): void {
    this.componentForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        login: ['', Validators.required],
      },
      { updateOn: 'blur' }
    );
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.authService.signUp(this.componentForm.getRawValue());
      this.signedUp = true;
    });
  }

  public async resendEmail(): Promise<void> {
    if (this.isLoading) return;
    const unverifiedEmail = localStorage.getItem('unverifiedEmail');
    if (!unverifiedEmail) return;

    this.isLoading = true;

    try {
      await this.authService.resendEmail(unverifiedEmail);
      this.openSnackbar();
      this.isLoading = false;
    } catch (error) {
      this.error = error as string;
      this.isLoading = false;
    }
  }

  public restartSignUp(): void {
    this.signedUp = false;
    localStorage.removeItem('unverifiedEmail');
  }

  private openSnackbar(): void {
    this.snackbar.open(
      `We've just sent you the email. Check your inbox`,
      undefined,
      {
        duration: 3000,
      }
    );
  }
}
