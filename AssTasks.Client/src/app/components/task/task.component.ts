import { CommonModule, formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../../models/task';

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

  getDueClass(due: string): string {
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

  getDueDateString(due: string): string {
    if (this.isOverdue(due)) {
      return "Due date has passed";
    } else if (this.isDueToday(due)) {
      return "Due today";
    } else if (this.isDueTomorrow(due)) {
      return "Due tomorrow";
    } else {
      return `Due ${formatDate(new Date(due), 'mediumDate', 'en-US')}`;
    }
  }

  isOverdue(due:string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }

  isDueToday(due: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  }

  isDueTomorrow(due: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === tomorrow.getTime();
  }
}
