import { FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseFormComponent } from '../../abstract/base-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class LoginComponent extends BaseFormComponent {
  constructor(private fb: FormBuilder, private authService: AuthService) {
    super();
  }

  public setAuthForm(): void {
    this.authForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        login: ['', Validators.required],
      },
      { updateOn: 'blur' }
    );
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(
      async () => await this.authService.login(this.authForm.getRawValue())
    );
  }
}
