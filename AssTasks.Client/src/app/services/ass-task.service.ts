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
  ) {}

  /**
   * Watcher method for receiving notifications that the task list has been updated
   * @returns A watchable that emits when the task list updates
   */
  public watchAssTasks(): Observable<boolean> {
    return this.assTasksUpdated.asObservable();
  }

  /**
   * Emitter method for when the list of tasks is updated
   */
  public emitAssTasksUpdated(): void {
    this.assTasksUpdated.next(true);
  }

  /**
   * Gets a specific task by ID
   * @param id the task ID to find and return
   * @returns a task matching the given ID, or undefined if no matching task was found
   */
  public getTask(id: number): Observable<Task | undefined> {
    throw Error("Method not implemented" + id);
  }

  /**
   * Gets all tasks
   * @returns all tasks
   */
  public getTasks(): Observable<Task[]> {
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
  public createTask(taskData: CreateAssTaskView): Observable<Task> {
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

  /**
   * Marks a given task a completed and generates the next task from the parent
   * @param taskId The task to complete
   */
  public completeAndRegenerateTask(taskId: number): Observable<void> {
    return this.httpClient
      .post<void>(APIConfig.url + `AssTasks/${taskId}/Complete`, { startDate: new Date().toISOString() })
      .pipe(
        tap({
          next: () => {
            this.emitAssTasksUpdated();
          }
        })
      );
  }

  /**
   * Reassigns a task to a new owner
   * @param taskId The Id of the Task to reassign
   * @param newOwnerId The new owner's Id
   */
  public reassignTask(taskId: number, newOwnerId: number): Observable<void> {
    return this.httpClient
      .post<void>(APIConfig.url + `AssTasks/${taskId}/Reassign`, newOwnerId)
      .pipe(
        tap({
          next: () => {
            this.emitAssTasksUpdated();
          }
        })
      );
  }

  /**
   * Resets, or 'snoozes' a task to its next calculated due date
   * @param taskId The Id of the task to snooze
   */
  public snoozeTask(taskId: number): Observable<void> {
    return this.httpClient
      .post<void>(APIConfig.url + `AssTasks/${taskId}/Snooze`, null)
      .pipe(
        tap({
          next: () => {
            this.emitAssTasksUpdated();
          }
        })
      );
  }

  /**
   * Directly sets a task's DueDate
   * @param taskId The Id of the task to set
   * @param dueDate The new due date
   */
  public setTaskDueDate(taskId: number, dueDate: Date): Observable<void> {
    return this.httpClient
      .put<void>(APIConfig.url + `AssTasks/${taskId}/DueDate`, dueDate)
      .pipe(
        tap( {
          next: () => {
            this.emitAssTasksUpdated();
          }
        })
      );
  }
}
