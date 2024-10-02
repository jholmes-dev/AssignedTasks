import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [MatListModule, MatIcon],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss'
})
export class ActionMenuComponent {

  constructor(
    private _actionMenuRef: MatBottomSheetRef<ActionMenuComponent>,
    private modalService: ModalService
  ) {}

  openCreateTaskModal(): void {
    this.modalService.emitCreateTaskModalState({ state: true, data: { taskParent: null }});
    this.close();
  }

  openCreateEditUserModal(): void {
    this.modalService.emitCreateEditUserModalState({ state: true, data: { user: null } });
    this.close();
  }

  openManageTasksModal(): void {
    this.modalService.emitManageTasksModalState({ state: true });
    this.close();
  }

  openManageUserModal(): void {
    this.modalService.emitManageUsersModalState({ state: true });
    this.close();
  }

  close() {
    this._actionMenuRef.dismiss();
  }
}
