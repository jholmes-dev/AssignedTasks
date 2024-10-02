import { finalize, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { User } from '../../../models/user';
import { ModalService } from '../../../services/modal.service';
import { UserService } from '../../../services/user.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-manage-users-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIcon,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-users-modal.component.html',
  styleUrl: './manage-users-modal.component.scss'
})
export class ManageUsersModalComponent {
  private watchUsersSub!: Subscription;
  readonly confirmModal = inject(MatDialog);
  public users: User[] = [];
  public displayedColumns: string[] = [ "createdAt", "name", "controls" ];
  public loading: boolean = true;

  constructor(
    private userService: UserService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    // Initial load call
    this.loadUsers();

    // Load new Users when service emits
    this.watchUsersSub = this.userService.watchUsers()
      .subscribe({
        next: () => {
          this.loadUsers();
        }
      });
  }

  /**
   * Loads Users from database
   */
  loadUsers() {
    this.loading = true;
    this.userService.getUsers()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe({
        next: (users: User[]) => {
          this.users = users;
        }
      });
  }

  /**
   * Opens confirmation dialog for task delete
   * @param user The User to delete
   */
  showDeleteConfirmation(user: User) {
    const dialogRef = this.confirmModal.open(ConfirmationModalComponent, {
      data: {
        title: "Confirm Deletion",
        content: `Are you sure you'd like to delete user: '${user.name}'?`,
        confirmText: "Delete",
      }
    });

    // Delete User on confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteUser(user);
      }
    });
  }

  /**
   * Sends a delete request for the given User
   * @param taskParent 
   */
  deleteUser(user: User): void {
    this.userService.deleteUser(user).subscribe();
  }

  /**
   * Opens edit modal for a TaskParent
   */
  openEditTaskParentModal(user: User): void {
    this.modalService.emitCreateEditUserModalState({
      state: true,
      data: {
        user: user
      }
    });
  }
}
