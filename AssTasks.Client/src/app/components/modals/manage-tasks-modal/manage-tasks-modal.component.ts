import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { TaskParent } from '../../../models/task-parent';
import { AssTaskParentService } from '../../../services/ass-task-parent.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-manage-tasks-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIcon
  ],
  templateUrl: './manage-tasks-modal.component.html',
  styleUrl: './manage-tasks-modal.component.scss'
})
export class ManageTasksModalComponent {
  readonly confirmModal = inject(MatDialog);
  public assTaskParents: TaskParent[] = [];
  public displayedColumns: string[] = [ "createdAt", "title", "active", "controls" ];

  constructor(
    private dialogRef: MatDialogRef<ManageTasksModalComponent>,
    private assTaskParentService: AssTaskParentService
  ) {}

  ngOnInit(): void {
    // Load AssTasks
    this.assTaskParentService.getTaskParents().subscribe({
      next: (taskParents: TaskParent[]) => {
        this.assTaskParents = taskParents;
      }
    });
  }

  showConfirmation() {
    this.confirmModal.open(ConfirmationModalComponent, {
      data: {
        title: "Confirm Deletion",
        content: "Are you sure you'd like to delete this record?"
      }
    });
  }
}
