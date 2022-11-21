import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardsListComponent } from './boards-list.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', component: BoardsListComponent },
  { path: ':boardId', component: BoardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
