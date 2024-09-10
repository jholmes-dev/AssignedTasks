import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { Task } from '../../../models/task';
import { AssTaskService } from '../../../services/ass-task.service';

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
  public assTasks: Task[] = [];
  public displayedColumns: string[] = [ "created_at", "title", "active" ];

  constructor(
    private dialogReg: MatDialogRef<ManageTasksModalComponent>,
    private assTaskService: AssTaskService
  ) {}

  ngOnInit(): void {
    // Load AssTasks
    this.assTaskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.assTasks = tasks;
      }
    });
  }
}
