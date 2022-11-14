import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatModule } from '../shared/mat.module';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { SignupSuccessComponent } from './sign-up/signup-success/signup-success.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';

@NgModule({
  declarations: [
    AuthComponent,
    SignUpComponent,
    LoginComponent,
    SignupSuccessComponent,
    EmailConfirmationComponent,
  ],
  providers: [AuthService],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatModule,
    RouterModule,
  ],
})
export class AuthModule {}
