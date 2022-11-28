import { NgModule } from '@angular/core';

import { BoardsRoutingModule } from './boards-routing.module';
import { BoardsListComponent } from './boards-list.component';
import { MatModule } from '../../shared/mat.module';
import { BoardComponent } from './components/board/board.component';
import { NewBoardComponent } from './components/new-board/new-board.component';
import { EditBoardComponent } from './components/edit-board/edit-board.component';
import { BoardHeaderComponent } from './components/board/components/board-header/board-header.component';
import { TaskModule } from '../tasks/task.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusModule } from '../statuses/status.module';
import { BoardInfoComponent } from './components/board/components/board-info/board-info.component';

@NgModule({
  declarations: [
    BoardsListComponent,
    BoardComponent,
    NewBoardComponent,
    EditBoardComponent,
    BoardHeaderComponent,
    BoardInfoComponent,
  ],
  imports: [
    MatModule,
    SharedModule,
    BoardsRoutingModule,
    TaskModule,
    StatusModule,
  ],
  providers: [],
})
export class BoardsModule {}
