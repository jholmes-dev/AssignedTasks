import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ReassignTaskModalData } from '../../../models/modal-data';
import { User } from '../../../models/user';
import { AssTaskService } from '../../../services/ass-task.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-reassign-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './reassign-task-modal.component.html',
  styleUrl: './reassign-task-modal.component.scss'
})
export class ReassignTaskModalComponent {
  public users: User[] = [];
  public modalData: ReassignTaskModalData = inject(MAT_DIALOG_DATA);

  constructor(
    private dialogRef: MatDialogRef<ReassignTaskModalComponent>,
    private userService: UserService,
    private assTaskService: AssTaskService
  ) {}

  public ngOnInit(): void {
    // Initial call
    this.loadUsers();

    // Reload users any time they're refreshed
    this.userService.watchUsers().subscribe(() => {
      this.loadUsers();
    });
  } 

  public loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users.filter((user: User) => user.id !== this.modalData.data.task.ownerId);
    });
  }

  public submitReassignment(newOwnerId: number): void {
    this.assTaskService.reassignTask(this.modalData.data.task.id, newOwnerId).subscribe(() => {
      this.dialogRef.close();
    });
  }
}
