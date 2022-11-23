import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app-routes.enum';
import { AuthComponent } from './components/auth/auth.component';
import { EmailConfirmationComponent } from './components/auth/components/email-confirmation/email-confirmation.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { UnverifiedGuard } from './guards/unverified.guard';
import { NewBoardComponent } from './components/boards/components/new-board/new-board.component';
import { SettingsComponent } from './components/settings/settings.component';

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
      import('./components/boards/boards.module').then((m) => m.BoardsModule),
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.MyBoards,
    loadChildren: () =>
      import('./components/boards/boards.module').then((m) => m.BoardsModule),
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.NewBoard,
    component: NewBoardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: AppRoutes.Settings,
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
