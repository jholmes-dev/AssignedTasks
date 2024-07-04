import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Modals } from '../../constants/modals.constant';
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

  signalCreateTask(): void {
    this.modalService.emitModalState(Modals.CREATE_TASK, true);
    this.close();
  }

  close() {
    this._actionMenuRef.dismiss();
  }
}
