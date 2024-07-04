import { Component } from '@angular/core';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskGridEmptyComponent } from '../task-grid-empty/task-grid-empty.component';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-grid',
  standalone: true,
  imports: [TaskGridEmptyComponent, TaskComponent],
  templateUrl: './task-grid.component.html',
  styleUrl: './task-grid.component.scss'
})
export class TaskGridComponent {
  public tasks: Task[] = [];

  constructor(
      private taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks = tasks);
  }
}
