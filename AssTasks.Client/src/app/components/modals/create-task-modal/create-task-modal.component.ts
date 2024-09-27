import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

import { TaskPriorities, TaskTypes } from '../../../constants/task.constants';
import { CreateAssTaskView } from '../../../models/views/create-asstask-view.model';
import { AssTaskService } from '../../../services/ass-task.service';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatDatepickerModule
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss'
})
export class CreateTaskModalComponent {
  public createTaskForm!: FormGroup; 
  public taskTypes = TaskTypes;
  public taskPriorities = TaskPriorities;

  constructor(
    private assTaskService: AssTaskService,
    private dialogRef: MatDialogRef<CreateTaskModalComponent>
  ) {}

  ngOnInit(): void {
    this.createTaskForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
      ]),
      description: new FormControl(''),
      frequencyType: new FormControl(this.taskTypes.INTERVAL_TASK, [
        Validators.required,
      ]),
      priority: new FormControl(this.taskPriorities.NORMAL, [
        Validators.required,
      ]),
      frequency: new FormControl('1', [
        Validators.required,
      ]),
      days: new FormControl([], [
        this.daysRequiredIfRecurranceIsDays()
      ]),
      startDate: new FormControl(new Date(), [
        Validators.required
      ])
    });
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

    if (this.createTaskForm.valid) {
      const taskData: CreateAssTaskView = this.createTaskForm.value;
      taskData.active = true;
      
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
