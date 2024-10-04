import { finalize } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-create-edit-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-edit-user-modal.component.html',
  styleUrl: './create-edit-user-modal.component.scss'
})
export class CreateEditUserModalComponent {
  modalData: { user: User | null } = inject(MAT_DIALOG_DATA);
  private user: User | null = null;
  public saving: boolean = false;
  public isEdit: boolean = false;
  public createUserForm!: FormGroup;

  constructor(
    private diaglogRef: MatDialogRef<CreateEditUserModalComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.modalData?.user != null) {
      this.isEdit = true;
      this.user = this.modalData.user;
    }

    this.createUserForm = new FormGroup({
      Name: new FormControl(this.user?.name ?? "", [
          Validators.required
      ]),
    });
  }

  public submit() {
    if (!this.createUserForm.valid) {
      return;
    }

    this.saving = true;
    const userData: User = this.createUserForm.value;

    if (this.isEdit) {
      userData.id = this.user?.id;
      this.userService.updateUser(userData)
        .pipe(
          finalize(() => {
            this.saving = false;
            this.diaglogRef.close();
          })
        ).subscribe();
    } else {
      this.userService.createUser(userData)
        .pipe(
          finalize(() => {
            this.saving = false;
            this.diaglogRef.close();
          })
        ).subscribe();
    }
  }
}
