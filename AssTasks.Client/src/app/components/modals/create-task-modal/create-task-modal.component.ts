import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
    AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';

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
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss'
})
export class CreateTaskModalComponent {
  createTaskForm!: FormGroup; 

  ngOnInit(): void {
    this.createTaskForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
      ]),
      description: new FormControl(''),
      recurrance: new FormControl('interval', [
        Validators.required,
      ]),
      priority: new FormControl('normal', [
        Validators.required,
      ]),
      frequency: new FormControl('1', [
        Validators.required,
      ]),
      days: new FormControl([], [
        this.daysRequiredIfRecurranceIsDays()
      ])
    });
  }

  daysRequiredIfRecurranceIsDays(): ValidatorFn { 
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent?.get('recurrance')?.value === "days" && control.value) {
        return control.value.length <= 0 ? 
          {daysRequired: {value: control.value}} : null;
      }
      return null;
    };
  }

  submit(): void {
    //
  }

}
