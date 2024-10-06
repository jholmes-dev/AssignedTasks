import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-asstask-action-menu',
  standalone: true,
  imports: [
    MatListModule, 
    MatIcon
  ],
  templateUrl: './asstask-action-menu.component.html',
  styleUrl: './asstask-action-menu.component.scss'
})
export class AssTaskActionMenuComponent {

  constructor(
    private _actionMenuRef: MatBottomSheetRef<AssTaskActionMenuComponent>,
    private modalService: ModalService
  ) {}



  close() {
    this._actionMenuRef.dismiss();
  }
}
