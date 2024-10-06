import { CommonModule, formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DaysAbbv } from '../../constants/days.constant';
import { TaskTypes } from '../../constants/task.constants';
import { Task } from '../../models/task';
import { User } from '../../models/user';
import { ModalService } from '../../services/modal.service';
import { AssTaskActionMenuComponent } from '../asstask-action-menu/asstask-action-menu.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;
  @Input() users: User[] = [];
  public taskOwner: User | undefined;

  constructor(
    private modalService: ModalService,
    private actionMenu: MatBottomSheet
  ) {}

  ngOnChanges(): void {
    this.taskOwner = this.users.find((user) => user.id == this.task.ownerId)
  }

  public openCompleteTaskDialog(): void {
    this.modalService.emitCompleteTaskModalState({ state: true, data: { task: this.task } });
  }

  public openAssTaskActionMenu(): void {
    this.actionMenu.open(AssTaskActionMenuComponent, {
      data: this.task
    });
  }

  public getDueClass(due: Date): string {
    if (this.isOverdue(due)) {
      return "task-due-overdue";
    } else if (this.isDueToday(due)) {
      return "task-due-today";
    } else if (this.isDueTomorrow(due)) {
      return "task-due-tomorrow";
    } else {
      return "";
    }
  }

  public getDueDateString(due: Date): string {
    const daysUntilDue = this.getDaysUntilDue(due);
    if (daysUntilDue < 0) {
      return `${Math.abs(daysUntilDue)} Day${daysUntilDue === -1 ? '' : 's'} Overdue`;
    } else if (daysUntilDue === 0) {
      return "Today";
    } else if (daysUntilDue === 1) {
      return "Tomorrow";
    } else {
      return `${formatDate(new Date(due), 'mediumDate', 'en-US')}`;
    }
  }
  
  private getDaysString(daysArray: number[]): string {
    return daysArray.map((day: number) => {
      return DaysAbbv[day];
    }).join(", ");
  }

  public getTaskIntervalString(task: Task): string {
    switch (task.taskParent.frequencyType)
    {
      case TaskTypes.DAYS_TASK:
        return this.getDaysString(task.taskParent.days) + ` every ${task.taskParent.frequency > 1 ? task.taskParent.frequency + " " : ""}week${task.taskParent.frequency > 1 ? "s" : ""}`;
      case TaskTypes.INTERVAL_TASK:
        return `Every ${task.taskParent.frequency > 1 ? task.taskParent.frequency + " " : ""}day${task.taskParent.frequency > 1 ? "s" : ""}`
      default:
        return "Task type not supported";
    }
  }

  public isOverdue(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  public getDaysUntilDue(due: Date): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return (dueDate.getTime() - today.getTime()) / 1000 / 60 / 60 / 24;;
  }

  public isDueToday(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }

  public isDueTomorrow(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === tomorrow.getTime();
  }
}
