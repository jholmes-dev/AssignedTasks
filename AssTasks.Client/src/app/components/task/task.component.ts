import { CommonModule, formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Modals } from '../../constants/modals.constant';
import { Task } from '../../models/task';
import { ModalService } from '../../services/modal.service';

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

  constructor(
    private modalService: ModalService
  ) {}

  openCompleteTaskDialog() {
    this.modalService.emitModalState(Modals.COMPLETE_TASK, true);
  }

  getDueClass(due: Date): string {
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

  getDueDateString(due: Date): string {
    if (this.isOverdue(due)) {
      return "Overdue";
    } else if (this.isDueToday(due)) {
      return "Due today";
    } else if (this.isDueTomorrow(due)) {
      return "Due tomorrow";
    } else {
      return `Due ${formatDate(new Date(due), 'mediumDate', 'en-US')}`;
    }
  }

  isOverdue(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  isDueToday(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }

  isDueTomorrow(due: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === tomorrow.getTime();
  }
}
