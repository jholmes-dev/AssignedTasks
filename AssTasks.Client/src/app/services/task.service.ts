import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIConfig } from '../constants/api.constant';
import { TaskTypes } from '../constants/task.constants';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  taskData: Task[] = [
    {
      id: 0,
      created_at: new Date(),
      parent: {
        id: 0,
        title: "Declutter dining table",
        description: "This is a testing task. Do it",
        active: true,
        priority: 2,
        frequency: 3,
        type: TaskTypes.INTERVAL_TASK,
        created_at: new Date() 
      }
    },
    {
      id: 1,
      created_at: new Date(),
      parent: {
        id: 0,
        title: "Test task 2",
        description: "This is a day specific task",
        active: true,
        priority: 3,
        frequency: 1,
        type: TaskTypes.DAYS_TASK,
        created_at: new Date(),
        days: [ 1, 3, 5 ]
      }
    },
    {
      id: 3,
      created_at: new Date(),
      parent: {
        id: 0,
        title: "Test task 3",
        active: true,
        priority: 3,
        frequency: 3,
        type: TaskTypes.INTERVAL_TASK,
        created_at: new Date()
      }
    }
  ]

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Gets a specific task by ID
   * @param id the task ID to find and return
   * @returns a task matching the given ID, or undefined if no matching task was found
   */
  getTask(id: number): Observable<Task | undefined> {
    return of(this.taskData.find(t => t.id === id));
  }

  /**
   * Gets all tasks
   * @returns all tasks
   */
  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(APIConfig.url + "TaskParents");
  }
}
