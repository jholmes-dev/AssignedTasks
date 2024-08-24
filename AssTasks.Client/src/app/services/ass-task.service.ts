import { map, Observable, Subject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIConfig } from '../constants/api.constant';
import { Task } from '../models/task';
import { CreateAssTaskView } from '../models/views/create-asstask-view.model';

@Injectable({
  providedIn: 'root'
})
export class AssTaskService {
  private assTasksUpdated = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Watcher method for receiving notifications that the task list has been updated
   * @returns A watchable that emits when the task list updates
   */
  watchAssTasks(): Observable<boolean> {
    return this.assTasksUpdated.asObservable();
  }

  /**
   * Emitter method for when the list of tasks is updated
   */
  emitAssTasksUpdated(): void {
    this.assTasksUpdated.next(true);
  }

  /**
   * Gets a specific task by ID
   * @param id the task ID to find and return
   * @returns a task matching the given ID, or undefined if no matching task was found
   */
  getTask(id: number): Observable<Task | undefined> {
    throw Error("Method not implemented" + id);
  }

  /**
   * Gets all tasks
   * @returns all tasks
   */
  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(APIConfig.url + "AssTasks")
      .pipe(
        map((tasks: Task[]) => {
          return tasks.map((task: Task) => {
            task.createdAt = new Date(task.createdAt);
            task.dueAt = new Date(task.dueAt);
            task.completedAt = task.completedAt ? new Date(task.completedAt) : undefined;
            return task;
          });
        })
      );
  }

  /**
   * Creates a new TaskParent, which generates and returns the next AssTask
   * @returns the created AssTask
   */
  createTask(taskData: CreateAssTaskView): Observable<Task> {
    return this.httpClient
      .post<Task>(APIConfig.url + "TaskParents/CreateAndGenerateTask", taskData)
      .pipe(
        tap({
          next: () => {
            this.emitAssTasksUpdated();
          }
        })
      );
  }
}
