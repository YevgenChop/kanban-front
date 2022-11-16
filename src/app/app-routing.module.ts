import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app-routes.enum';
import { AuthComponent } from './auth/auth.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { UnverifiedGuard } from './guards/unverified.guard';

const routes: Routes = [
  {
    path: AppRoutes.LogIn,
    component: AuthComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: AppRoutes.SignUp,
    component: AuthComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: AppRoutes.EmailConfirmation,
    component: EmailConfirmationComponent,
    canActivate: [UnauthGuard, UnverifiedGuard],
  },
  {
    path: AppRoutes.Boards,
    loadChildren: () =>
      import('./boards-list/boards.module').then((m) => m.BoardsModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
