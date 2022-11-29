import { Injectable } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private sidenav!: MatDrawer;

  public setSidenav(drawer: MatDrawer): void {
    this.sidenav = drawer;
  }

  public toggle(): void {
    if (!this.sidenav) return;
    this.sidenav.toggle();
  }

  public open(): void {
    if (!this.sidenav) return;
    this.sidenav.open();
  }

  public close(): void {
    if (!this.sidenav) return;
    this.sidenav.close();
  }
}
