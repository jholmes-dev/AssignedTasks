import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CompleteTaskModalData } from '../../../models/modal-data';
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
  data: CompleteTaskModalData = inject(MAT_DIALOG_DATA);
  private _snackBar = inject(MatSnackBar);

  constructor(
    private assTaskService: AssTaskService,
    private dialogRef: MatDialogRef<CompleteTaskModalComponent>
  ) {}

  public completeTask() {
    this.assTaskService.completeAndRegenerateTask(this.data.data.task.id)
      .subscribe({
        next: () => {
          this._snackBar.open('Task Completed!', 'Close', {
            verticalPosition: "top",
            duration: 3000
          });
          this.dialogRef.close();
        }
      });
  }
}