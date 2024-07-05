import { Subscription } from 'rxjs';

import { Component } from '@angular/core';

import { Task } from '../../models/task';
import { AssTaskService } from '../../services/ass-task.service';
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
  private watchTasksSub!: Subscription;

  constructor(
      private taskService: AssTaskService
  ) {}

  ngOnInit() {
    // Initial get call
    this.getAssTasks();

    // Refresh tasks each time taskService emits changes
    this.watchTasksSub = this.taskService
      .watchAssTasks()
      .subscribe({
        next: () => {
          this.getAssTasks();
        }
      });
  }

  getAssTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => this.tasks = tasks);
  }

  ngOnDestroy() {
    this.watchTasksSub.unsubscribe();
  }
}
