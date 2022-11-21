import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'chat-app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  public isSignUpMode = this.route.snapshot.url[1].path === 'signup';

  constructor(private route: ActivatedRoute) {}
}
