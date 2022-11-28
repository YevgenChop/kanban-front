import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './components/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatModule } from './shared/mat.module';
import { SettingsComponent } from './components/settings/settings.component';
import { UsersSearchComponent } from './shared/components/users-search/users-search.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, SidenavComponent, SettingsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    MatModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  exports: [UsersSearchComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
