import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, takeUntil } from 'rxjs';
import { UiComponent } from '../../../..//abstract/ui-component.component';
import { IStatus } from '../../../..//models/status.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusesStore } from '../../../..//store/statuses.store';
import { ColumnsService } from '../../../boards/components/board/services/columns.service';
import { DragAndDropService } from '../../../boards/components/board/services/drag-and-drop.service';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusListComponent
  extends UiComponent
  implements AfterContentChecked
{
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
    private columnsService: ColumnsService,
    private matDialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
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
    const shouldDelete = await firstValueFrom(
      this.matDialog.open(ConfirmDialogComponent).afterClosed()
    );

    if (!shouldDelete) return;

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
