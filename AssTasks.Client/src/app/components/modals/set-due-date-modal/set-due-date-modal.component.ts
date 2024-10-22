import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SetDueDateModalData } from '../../../models/modal-data';
import { AssTaskService } from '../../../services/ass-task.service';

@Component({
  selector: 'app-set-due-date-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './set-due-date-modal.component.html',
  styleUrl: './set-due-date-modal.component.scss'
})
export class SetDueDateModalComponent {
  public setDueDateForm: FormGroup = new FormGroup({}); 
  public modalData: SetDueDateModalData = inject(MAT_DIALOG_DATA);
  public saving: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<SetDueDateModalComponent>,
    private assTaskService: AssTaskService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.setDueDateForm = new FormGroup({
      newDueDate: new FormControl(new Date(), [
        Validators.required
      ])
    });
  }

  public submit() {
    this.saving = true;
    
    this.assTaskService.setTaskDueDate(this.modalData.data.task.id, this.setDueDateForm.get("newDueDate")?.value)
      .subscribe({
        next: () => {
          this._snackBar.open("Task has been updated", 'Close', {
            verticalPosition: "top",
            duration: 3000
          });
          this.dialogRef.close();
        },
        error: () => {
          this._snackBar.open("Something went wrong...", 'Close', {
            verticalPosition: "top",
            duration: 3000
          });
        }
      })
  }
}
