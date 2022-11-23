import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersSearchComponent } from '../components/shared/users-search/users-search.component';
import { MatModule } from './mat.module';

@NgModule({
  declarations: [UsersSearchComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatModule],
  exports: [
    UsersSearchComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
