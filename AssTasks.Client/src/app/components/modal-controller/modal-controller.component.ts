import { Subscription } from 'rxjs';

import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Modals } from '../../constants/modals.constant';
import { ModalService } from '../../services/modal.service';
import { CreateTaskModalComponent } from '../modals/create-task-modal/create-task-modal.component';

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
  createTaskSub!: Subscription;

  constructor(
    private modalService: ModalService
  ) {}

  ngOnInit() {
    // Add task modal
    this.createTaskSub = this.modalService.getModalSubject(Modals.CREATE_TASK).subscribe((state: boolean) => {
      if (state) {
        this.createTaskDialog.open(CreateTaskModalComponent, {
          width: "700px"
        });
      }
    });
  }

  ngOnDestroy() {
    this.createTaskSub.unsubscribe();
  }
}
