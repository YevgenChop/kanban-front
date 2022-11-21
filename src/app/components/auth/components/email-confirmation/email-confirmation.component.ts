import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss'],
})
export class EmailConfirmationComponent implements OnInit {
  private token = this.route.snapshot.queryParams['token'];
  public isLoading!: boolean;
  public error!: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.authService.verifyUser(this.token);
      this.isLoading = false;
      setTimeout(() => this.router.navigateByUrl('/auth/login'), 3000);
    } catch (error) {
      this.error = error as string;
      this.isLoading = false;
    }
  }

  public async resendEmail(): Promise<void> {
    const unverifiedEmail = localStorage.getItem('unverifiedEmail');
    if (!unverifiedEmail) return;

    try {
      await this.authService.resendEmail(unverifiedEmail);
    } catch (error) {
      this.error = error as string;
    }
  }
}
