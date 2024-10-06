import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { Task } from '../../models/task';
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
    private modalService: ModalService
  ) {}

  close() {
    this._actionMenuRef.dismiss();
  }
}
