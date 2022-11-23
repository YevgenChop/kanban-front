import { Component, Input } from '@angular/core';
import { takeUntil } from 'rxjs';
import { UiComponent } from 'src/app/abstract/ui-component.component';
import { IStatus } from 'src/app/models/status.model';
import { StatusesStore } from 'src/app/store/statuses.store';
import { ColumnsService } from '../../../board/services/columns.service';
import { DragAndDropService } from '../../../board/services/drag-and-drop.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
})
export class StatusListComponent extends UiComponent {
  @Input() boardId!: string;
  @Input() getColumns!: () => string[];

  public statuses!: IStatus[];
  public editMode = false;
  public editedStatus!: string;
  public columns!: string[];

  constructor(
    private statusService: StatusService,
    private statusesStore: StatusesStore,
    private dragAndDropService: DragAndDropService,
    private columnsService: ColumnsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.statusesStore.statuses$
      .pipe(takeUntil(this.notifier$))
      .subscribe((statuses) => {
        this.statuses = statuses;
        this.columns = this.getColumns();
      });
  }

  public drop(event: any): void {
    this.dragAndDropService.dropColumn(event);
    this.columnsService.saveColumnsOrder(this.boardId, this.columns);
  }

  public isCustom(status: string): boolean {
    return this.statuses.find((s) => s.title === status)?.custom as boolean;
  }

  public async deleteStatus(status: string): Promise<void> {
    await this.statusService.deleteStatus(
      this.statuses.find((s) => s.title === status)?.id as string
    );
  }

  public switchEditModeOn(status: string): void {
    this.editMode = true;
    this.editedStatus = status;
  }

  public switchEditModeOff(): void {
    this.editMode = false;
    this.editedStatus = '';
  }

  public getStatusId(status: string): string {
    return this.statuses.find((s) => s.title === status)?.id as string;
  }
}
