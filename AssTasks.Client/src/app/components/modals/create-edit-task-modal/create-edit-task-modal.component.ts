import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
    AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { TaskPriorities, TaskTypes } from '../../../constants/task.constants';
import { TaskParent } from '../../../models/task-parent';
import { User } from '../../../models/user';
import { CreateAssTaskView } from '../../../models/views/create-asstask-view.model';
import { EditAssTaskView } from '../../../models/views/edit-asstask-view.model';
import { AssTaskParentService } from '../../../services/ass-task-parent.service';
import { AssTaskService } from '../../../services/ass-task.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-edit-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatDatepickerModule,
    MatOption,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './create-edit-task-modal.component.html',
  styleUrl: './create-edit-task-modal.component.scss'
})
export class CreateEditTaskModalComponent {
  modalData: { taskParent: TaskParent | null } = inject(MAT_DIALOG_DATA);
  private taskParent: TaskParent | null = null;
  public users: User[] = [];
  public isEdit: boolean = false;
  public createTaskForm: FormGroup = new FormGroup({}); 
  public taskTypes = TaskTypes;
  public taskPriorities = TaskPriorities;

  constructor(
    private assTaskService: AssTaskService,
    private taskParentService: AssTaskParentService,
    private userService: UserService,
    private dialogRef: MatDialogRef<CreateEditTaskModalComponent>
  ) {}

  ngOnInit(): void {
    if (this.modalData?.taskParent != null) {
      this.isEdit = true;
      this.taskParent = this.modalData.taskParent;
    }

    this.initForm();

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      }
    });
  }

  private initForm(): void {
    this.createTaskForm = new FormGroup({
      Title: new FormControl(this.taskParent?.title ?? "", [
        Validators.required,
      ]),
      Description: new FormControl(this.taskParent?.description ?? ""),
      FrequencyType: new FormControl(this.taskParent?.frequencyType ?? this.taskTypes.INTERVAL_TASK, [
        Validators.required,
      ]),
      Priority: new FormControl(this.taskParent?.priority ?? this.taskPriorities.NORMAL, [
        Validators.required,
      ]),
      Frequency: new FormControl(this.taskParent?.frequency ?? '1', [
        Validators.required, 
      ]),
      Days: new FormControl(this.taskParent?.days ?? [], [
        this.daysRequiredIfRecurranceIsDays()
      ]),
      StartDate: new FormControl(new Date(), [
        Validators.required
      ])
    });

    if (!this.isEdit) {
      this.createTaskForm.addControl("OwnerId", new FormControl(null, [
        Validators.required
      ]));
    }
  }

  /**
   * Marks the days array as required or optional depending on the recurrance selected
   * @returns if required or not
   */
  daysRequiredIfRecurranceIsDays(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent?.get('frequencyType')?.value === this.taskTypes.DAYS_TASK && control.value) {
        return control.value.length <= 0 ? 
          {daysRequired: {value: control.value}} : null;
      }
      return null;
    };
  }

  submit(): void {
    // Reevaluate the days field
    this.createTaskForm.get('days')?.updateValueAndValidity();

    if (!this.createTaskForm.valid) {
      return;
    }

    if (this.isEdit && this.taskParent) {
      const taskData: EditAssTaskView = this.createTaskForm.value;
      taskData.Active = true;
      taskData.Id = this.taskParent.id;
      taskData.CreatedAt = this.taskParent.createdAt;
        
        this.taskParentService
          .updateTaskParent(taskData)
          .subscribe({
            next: () => {
              this.dialogRef.close();
            }
        });
    } 
    else {
      const taskData: CreateAssTaskView = this.createTaskForm.value;
        taskData.Active = true;
        
        this.assTaskService
          .createTask(taskData)
          .subscribe({
            next: () => {
              this.dialogRef.close();
            }
        });
    }
  }
}
