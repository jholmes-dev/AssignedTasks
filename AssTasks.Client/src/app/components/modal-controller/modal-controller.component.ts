import { Subscription } from 'rxjs';

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Modals } from '../../constants/modals.constant';
import { ModalService } from '../../services/modal.service';
import {
    CompleteTaskModalComponent
} from '../modals/complete-task-modal/complete-task-modal.component';
import { CreateTaskModalComponent } from '../modals/create-task-modal/create-task-modal.component';
import {
    ManageTasksModalComponent
} from '../modals/manage-tasks-modal/manage-tasks-modal.component';

@Component({
  selector: 'app-modal-controller',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  templateUrl: './modal-controller.component.html',
  styleUrl: './modal-controller.component.scss'
})
export class ModalControllerComponent {
  readonly createTaskDialog = inject(MatDialog);
  readonly completeTaskDialog = inject(MatDialog);
  readonly manageTasksDialog = inject(MatDialog);

  createTaskSub!: Subscription;
  completeTaskSub!: Subscription;
  manageTasksSub!: Subscription;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Add Create Task Modal
    this.createTaskSub = this.modalService.getModalSubject(Modals.CREATE_TASK).subscribe((state: boolean) => {
      if (state) {
        this.createTaskDialog.open(CreateTaskModalComponent, {
          width: "700px"
        });
      }
    });
    
    // Add Complete Task Modal
    this.completeTaskSub = this.modalService.getModalSubject(Modals.COMPLETE_TASK).subscribe((state: boolean) => {
      if (state) {
        this.completeTaskDialog.open(CompleteTaskModalComponent);
      }
    });

    // Add Manage Tasks Modal
    this.manageTasksSub = this.modalService.getModalSubject(Modals.MANAGE_TASKS).subscribe((state: boolean) => {
      if (state) {
        this.manageTasksDialog.open(ManageTasksModalComponent);
      }
    });
  }

  ngOnDestroy() {
    this.createTaskSub.unsubscribe();
    this.completeTaskSub.unsubscribe();
    this.manageTasksSub.unsubscribe();
  }
}
