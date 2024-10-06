import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Task } from '../../models/task';
import { AssTaskService } from '../../services/ass-task.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-asstask-action-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule, 
    MatIcon
  ],
  templateUrl: './asstask-action-menu.component.html',
  styleUrl: './asstask-action-menu.component.scss'
})
export class AssTaskActionMenuComponent {
  public data: Task = inject(MAT_BOTTOM_SHEET_DATA);

  constructor(
    private _actionMenuRef: MatBottomSheetRef<AssTaskActionMenuComponent>,
    private modalService: ModalService,
    private assTaskService: AssTaskService
  ) {}

  public openReassignTaskDialog(): void {
    this.modalService.emitReassignTaskModalState({ state: true, data: { task: this.data } });
    this.close();
  }

  public snoozeTask(): void {
    this.assTaskService.snoozeTask(this.data.id).subscribe(() => {
      this.close();
    });
  }

  public close(): void {
    this._actionMenuRef.dismiss();
  }
}
