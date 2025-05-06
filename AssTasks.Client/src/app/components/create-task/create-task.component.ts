import {Component, inject} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule, ValidationErrors,
    ValidatorFn,
    Validators,
    FormArray
} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSliderModule} from "@angular/material/slider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatOption} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatStepperModule} from "@angular/material/stepper";
import {User} from "../../models/user";
import {TaskPriorities, TaskTypes} from "../../constants/task.constants";
import {AssTaskService} from "../../services/ass-task.service";
import {AssTaskParentService} from "../../services/ass-task-parent.service";
import {UserService} from "../../services/user.service";
import {TaskParent} from "../../models/task-parent";
import {MatIcon} from "@angular/material/icon";
import {MatChipListbox, MatChipOption, MatChipsModule} from "@angular/material/chips";

@Component({
  selector: 'app-create-task',
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
      MatFormFieldModule,
      MatSlideToggleModule,
      MatCheckboxModule,
      MatStepperModule,
      MatIcon,
      MatChipsModule,
      MatChipListbox,
      MatChipOption,
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
    private _formBuilder = inject(FormBuilder);
    public loaded = false;
    public users: User[] = [];
    public taskTypes = TaskTypes;
    public taskPriorities = TaskPriorities;

    public taskDetailsGroup: FormGroup = new FormGroup({});
    public taskFrequencyGroup: FormGroup = new FormGroup({});
    public taskAssignmentGroup: FormGroup = new FormGroup({});

    constructor(
        private assTaskService: AssTaskService,
        private taskParentService: AssTaskParentService,
        private userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.userService.getUsers().subscribe({
            next: (users: User[]) => {
                this.users = users;
                this.initForm();
                this.loaded = true;
            }
        });
    }

    private initForm(): void {

        this.taskDetailsGroup = new FormGroup({
            Title: new FormControl("", [
                Validators.required,
            ]),
            Description: new FormControl(""),
        });

        this.taskFrequencyGroup = new FormGroup({
            FrequencyType: new FormControl(this.taskTypes.INTERVAL_TASK, [
                Validators.required,
            ]),
            Priority: new FormControl(this.taskPriorities.NORMAL, [
                Validators.required,
            ]),
            Frequency: new FormControl(1, [
                Validators.required,
            ]),
            Days: new FormControl([], [
                this.daysRequiredIfRecurrenceIsDays()
            ]),
        });

        this.taskAssignmentGroup = new FormGroup({
            InitialAssigneeId: new FormControl(this.users[0].id, [ Validators.required ]),
            StartDate: new FormControl(new Date(), [
                Validators.required
            ]),
            EnableAssignableTo: new FormControl('', [
                Validators.required
            ]),
            AssignableTo: new FormControl('', [
                this.validateAssignableTo()
            ])
        });

        this.taskAssignmentGroup.get('AssignableTo')?.valueChanges.subscribe({
            next: (newVal: string[]) => this.checkAssigneeAvailability()
        });
        this.taskAssignmentGroup.get('EnableAssignableTo')?.valueChanges.subscribe({
            next: (newVal: string[]) => this.checkAssigneeAvailability()
        });
    }

    checkAssigneeAvailability(): void {
        if (!!this.taskAssignmentGroup.get('AssignableTo')?.value &&
            !this.taskAssignmentGroup.get('AssignableTo')?.value.includes(
                this.taskAssignmentGroup.get('InitialAssigneeId')?.value)) {
            this.taskAssignmentGroup.get('InitialAssigneeId')?.setValue('');
        }
    }

    /**
     * Marks the days array as required or optional depending on the recurrence selected
     * @returns Validator function
     */
    daysRequiredIfRecurrenceIsDays(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.parent?.get('frequencyType')?.value === this.taskTypes.DAYS_TASK && control.value) {
                return control.value.length <= 0 ?
                    {daysRequired: {value: control.value}} : null;
            }
            return null;
        };
    }

    /**
     * Validates AssignableTo field
     * @returns Validator function
     */
    validateAssignableTo(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            // No need to validate if AssignableTo is disabled
            if (control.parent?.get('EnableAssignableTo')?.value != true) {
                return null;
            }

            if (control.value == '') {
                return { selectionRequired: "Please select at least one assignee" };
            }

            return null;
        }
    }

    increaseRecurrenceAmount() {
        this.taskFrequencyGroup.controls['Frequency'].setValue(
            parseInt(this.taskFrequencyGroup.controls['Frequency'].value) + 1);
    }

    decreaseRecurrenceAmount() {
        this.taskFrequencyGroup.controls['Frequency'].setValue(
            Math.max(parseInt(this.taskFrequencyGroup.controls['Frequency'].value) - 1, 1));
    }

    getAssignableUsers(): User[] {
        if (!!this.taskAssignmentGroup.get('EnableAssignableTo')?.value) {
            let enabledUsers = this.taskAssignmentGroup.get('AssignableTo')?.value ?? [];
            return this.users.filter((user: User) => {
                return enabledUsers.includes(user.id);
            });
        }
        return this.users;
    }

}
