import { Subscription } from 'rxjs';

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
    BaseModalData, CompleteTaskModalData, CreateEditUserModalData, CreateTaskModalData
} from '../../models/modal-data';
import { ModalService } from '../../services/modal.service';
import {
    AsstaskActionsModalComponent
} from '../modals/asstask-actions-modal/asstask-actions-modal.component';
import {
    CompleteTaskModalComponent
} from '../modals/complete-task-modal/complete-task-modal.component';
import {
    CreateEditTaskModalComponent
} from '../modals/create-edit-task-modal/create-edit-task-modal.component';
import {
    CreateEditUserModalComponent
} from '../modals/create-edit-user-modal/create-edit-user-modal.component';
import {
    ManageTasksModalComponent
} from '../modals/manage-tasks-modal/manage-tasks-modal.component';
import {
    ManageUsersModalComponent
} from '../modals/manage-users-modal/manage-users-modal.component';

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
  readonly createEditUserDialog = inject(MatDialog);
  readonly completeTaskDialog = inject(MatDialog);
  readonly manageTasksDialog = inject(MatDialog);
  readonly manageUsersDialog = inject(MatDialog);
  readonly assTaskActionsDialog = inject(MatDialog);

  createTaskSub!: Subscription;
  createEditUserSub!: Subscription;
  completeTaskSub!: Subscription;
  manageTasksSub!: Subscription;
  manageUsersSub!: Subscription;
  assTaskActionsSub!: Subscription;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Register Create Task Modal
    this.createTaskSub = this.modalService.getCreateTaskModalSubject().subscribe((modalData: CreateTaskModalData) => {
      if (modalData.state) {
        this.createTaskDialog.open(CreateEditTaskModalComponent, {
          width: "700px",
          data: modalData.data
        });
      }
    });

    // Register Create Edit User Modal
    this.createEditUserSub = this.modalService.getCreateEditUserModalSubject().subscribe((modalData: CreateEditUserModalData) => {
      if (modalData.state) {
        this.createTaskDialog.open(CreateEditUserModalComponent, {
          data: modalData.data
        });
      }
    });
    
    // Register Complete Task Modal
    this.completeTaskSub = this.modalService.getCompleteTaskModalSubject().subscribe((modalData: CompleteTaskModalData) => {
      if (modalData.state) {
        this.completeTaskDialog.open(CompleteTaskModalComponent, {
          data: modalData
        });
      }
    });

    // Register Manage Tasks Modal
    this.manageTasksSub = this.modalService.getManageTasksModalSubject().subscribe((modalData: BaseModalData) => {
      if (modalData.state) {
        this.manageTasksDialog.open(ManageTasksModalComponent);
      }
    });

    // Register Users Modal
    this.manageUsersSub = this.modalService.getManageUsersModalSubject().subscribe((modalData: BaseModalData) => {
      if (modalData.state) {
        this.manageUsersDialog.open(ManageUsersModalComponent);
      }
    });

    // AssTask Actions Modal
    this.assTaskActionsSub = this.modalService.getAssTaskActionsModalSubject().subscribe((modalData: BaseModalData) => {
      if (modalData.state) {
        this.assTaskActionsDialog.open(AsstaskActionsModalComponent);
      }
    });
  }

  ngOnDestroy() {
    this.createTaskSub.unsubscribe();
    this.createEditUserSub.unsubscribe();
    this.completeTaskSub.unsubscribe();
    this.manageTasksSub.unsubscribe();
    this.manageUsersSub.unsubscribe();
    this.assTaskActionsSub.unsubscribe();
  }
}
