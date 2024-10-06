import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-asstask-actions-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './asstask-actions-modal.component.html',
  styleUrl: './asstask-actions-modal.component.scss'
})
export class AsstaskActionsModalComponent {

}
