import { NgModule } from '@angular/core';
import { AutofocusDirective } from 'src/app/directives/autofocus.directive';
import { MatModule } from 'src/app/shared/mat.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditStatusComponent } from './components/edit-status/edit-status.component';
import { NewStatusComponent } from './components/new-status/new-status.component';
import { StatusListComponent } from './components/status-list/status-list.component';
import { StatusDialogComponent } from './status-dialog.component';

@NgModule({
  declarations: [
    StatusDialogComponent,
    EditStatusComponent,
    AutofocusDirective,
    StatusListComponent,
    NewStatusComponent,
  ],
  imports: [MatModule, SharedModule],
})
export class StatusModule {}
