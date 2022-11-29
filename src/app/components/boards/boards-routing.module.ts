import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from '../tasks/task.component';
import { BoardsListComponent } from './boards-list.component';
import { BoardComponent } from './components/board/board.component';

const routes: Routes = [
  { path: '', component: BoardsListComponent },
  {
    path: ':boardId',
    component: BoardComponent,
    children: [{ path: 'task/:taskId', component: TaskComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardsRoutingModule {}
