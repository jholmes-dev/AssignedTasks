import { Component } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RouterOutlet } from '@angular/router';

import { ActionButtonComponent } from './components/action-button/action-button.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { ModalControllerComponent } from './components/modal-controller/modal-controller.component';
import { TaskGridComponent } from './components/task-grid/task-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    TaskGridComponent, 
    ActionButtonComponent, 
    ActionMenuComponent, 
    MatBottomSheetModule, 
    ModalControllerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private _actionMenu: MatBottomSheet
  ) {}

  openActionMenu(): void {
    this._actionMenu.open(ActionMenuComponent, {
      panelClass: "mat-bottom-sheet-container-medium"
    });
  }
}
