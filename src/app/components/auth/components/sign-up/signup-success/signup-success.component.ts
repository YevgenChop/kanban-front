import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.scss'],
})
export class SignupSuccessComponent {
  public email = localStorage.getItem('unverifiedEmail');
  @Output() restartSignUp = new EventEmitter<void>();
  @Output() resendEmail = new EventEmitter<void>();
  @Input() isLoading!: boolean;

  public emitSignUpRestart(): void {
    this.restartSignUp.emit();
  }

  public emitResendEmail(): void {
    this.resendEmail.emit();
  }
}
