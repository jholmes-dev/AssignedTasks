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
    MatIcon,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-tasks-modal.component.html',
  styleUrl: './manage-tasks-modal.component.scss'
})
export class ManageTasksModalComponent {
  private watchTaskParentsSub!: Subscription;
  readonly confirmModal = inject(MatDialog);
  public assTaskParents: TaskParent[] = [];
  public displayedColumns: string[] = [ "createdAt", "title", "active", "controls" ];
  public loading: boolean = true;

  constructor(
    private assTaskParentService: AssTaskParentService
  ) {}

  ngOnInit(): void {
    // Initial load call
    this.loadTaskParents();

    // Load new TaskParents when service emits
    this.watchTaskParentsSub = this.assTaskParentService
      .watchAssTaskParents()
      .subscribe({
        next: () => {
          this.loadTaskParents();
        }
      });
  }

  /**
   * Load TaskParents
   */
  loadTaskParents() {
    this.loading = true;
    this.assTaskParentService.getTaskParents()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (taskParents: TaskParent[]) => {
          this.assTaskParents = taskParents;
        }
      });
  }

  /**
   * Opens confirmation dialog for task delete
   * @param taskParent The TaskParent subject
   */
  showConfirmation(taskParent: TaskParent) {
    const dialogRef = this.confirmModal.open(ConfirmationModalComponent, {
      data: {
        title: "Confirm Deletion",
        content: `Are you sure you'd like to delete: '${taskParent.title}'?`,
        confirmText: "Delete",
      }
    });

    // Delete task parent on confirmation
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteTaskParent(taskParent);
      }
    });
  }

  /**
   * Sends a delete request for the given TaskParent
   * @param taskParent 
   */
  deleteTaskParent(taskParent: TaskParent) : void {
    this.assTaskParentService.deleteTaskParent(taskParent.id)
      .subscribe({
        next: () => {
          
        },
        error: () => {

        }
      })
  }
}
