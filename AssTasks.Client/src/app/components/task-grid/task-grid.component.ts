import { Subscription } from 'rxjs';

import { Component } from '@angular/core';

import { Task } from '../../models/task';
import { User } from '../../models/user';
import { AssTaskService } from '../../services/ass-task.service';
import { UserService } from '../../services/user.service';
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
  public users: User[] = [];
  private watchTasksSub!: Subscription;

  constructor(
      private taskService: AssTaskService,
      private userService: UserService
  ) {}

  ngOnInit() {
    // Initial get call
    this.getAssTasks();
    this.getUsers();

    // Refresh tasks each time taskService emits changes
    this.watchTasksSub = this.taskService.watchAssTasks()
      .subscribe({
        next: () => {
          this.getAssTasks();
        }
      });
  }

  getAssTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => this.tasks = tasks);
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => this.users = users);
  }

  ngOnDestroy() {
    this.watchTasksSub.unsubscribe();
  }
}
