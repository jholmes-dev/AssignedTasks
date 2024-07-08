import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { AssTaskService } from '../../../services/ass-task.service';

@Component({
  selector: 'app-complete-task-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './complete-task-modal.component.html',
  styleUrl: './complete-task-modal.component.scss'
})
export class CompleteTaskModalComponent {

  constructor(
    private assTaskService: AssTaskService,
    private dialogRef: MatDialogRef<CompleteTaskModalComponent>
  ) {}

}