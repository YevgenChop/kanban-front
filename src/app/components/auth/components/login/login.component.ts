import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BaseFormComponent } from '../../../../abstract/base-form.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../auth.component.scss'],
})
export class LoginComponent extends BaseFormComponent implements OnInit {
  private returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/boards';
  }

  public setForm(): void {
    this.componentForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        login: ['', Validators.required],
      },
      { updateOn: 'blur' }
    );
  }

  public override async handleSubmit(): Promise<void> {
    await super.handleSubmit(async () => {
      await this.authService.login(this.componentForm.getRawValue());
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
