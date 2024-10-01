import { Subscription } from 'rxjs';

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BaseModalData, CreateTaskModalData } from '../../models/modal-data';
import { ModalService } from '../../services/modal.service';
import {
    CompleteTaskModalComponent
} from '../modals/complete-task-modal/complete-task-modal.component';
import {
    CreateEditTaskModalComponent
} from '../modals/create-edit-task-modal/create-edit-task-modal.component';
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
    // Register Create Task Modal
    this.createTaskSub = this.modalService.getCreateTaskModalSubject().subscribe((modalData: CreateTaskModalData) => {
      if (modalData.state) {
        this.createTaskDialog.open(CreateEditTaskModalComponent, {
          width: "700px",
          data: modalData.data
        });
      }
    });
    
    // Register Complete Task Modal
    this.completeTaskSub = this.modalService.getCompleteTaskModalSubject().subscribe((modalData: BaseModalData) => {
      if (modalData.state) {
        this.completeTaskDialog.open(CompleteTaskModalComponent);
      }
    });

    // Register Manage Tasks Modal
    this.manageTasksSub = this.modalService.getManageTasksModalSubject().subscribe((modalData: BaseModalData) => {
      if (modalData.state) {
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
