import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { TaskParent } from '../../../models/task-parent';
import { AssTaskParentService } from '../../../services/ass-task-parent.service';

@Component({
  selector: 'app-manage-tasks-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  templateUrl: './manage-tasks-modal.component.html',
  styleUrl: './manage-tasks-modal.component.scss'
})
export class ManageTasksModalComponent {
  public assTaskParents: TaskParent[] = [];
  public displayedColumns: string[] = [ "createdAt", "title", "active" ];

  constructor(
    private dialogReg: MatDialogRef<ManageTasksModalComponent>,
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
}
