import { map, Observable, Subject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TaskParent } from '../models/task-parent';
import { EditAssTaskView } from '../models/views/edit-asstask-view.model';
import { AssTaskService } from './ass-task.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssTaskParentService {
  private assTaskParentsUpdated = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient,
    private assTaskService: AssTaskService
  ) { }

  /**
   * Watcher method for receiving notifications that the task parent list has been updated
   * @returns A watchable that emits when the task parent list updates
   */
  watchAssTaskParents(): Observable<boolean> {
    return this.assTaskParentsUpdated.asObservable();
  }

  /**
   * Emitter method for when the list of task parents is updated
   */
  emitAssTaskParentsUpdated(): void {
    this.assTaskParentsUpdated.next(true);
  }

  /**
   * Gets a specific task parent by ID
   * @param id the task parent ID to find and return
   * @returns a task parent matching the given ID, or undefined if no matching task parent was found
   */
  getTaskParent(id: number): Observable<TaskParent | undefined> {
    throw Error("Method not implemented " + id);
  }

  /**
   * Gets all tasks
   * @returns all tasks
   */
  getTaskParents(): Observable<TaskParent[]> {
    return this.httpClient.get<TaskParent[]>(environment.apiUrl + "TaskParents")
      .pipe(
        map((taskParents: TaskParent[]) => {
          return taskParents.map((taskParent: TaskParent) => {
            taskParent.createdAt = new Date(taskParent.createdAt);
            return taskParent;
          });
        })
      );
  }

  /**
   * Updates a TaskParent by Id
   * @param taskParent The TaskParent model to update
   */
  updateTaskParent(taskParent: EditAssTaskView): Observable<void> {
    return this.httpClient.put<void>(environment.apiUrl + `TaskParents/${taskParent.Id}`, taskParent)
      .pipe(
        tap({
          next: () => {
            this.emitAssTaskParentsUpdated();
            this.assTaskService.emitAssTasksUpdated();
          }
        })
      );
  }

  /**
   * Deletes a TaskParent by id
   * @param id
   * @returns an Observable that deletes the task for the given id
   */
  deleteTaskParent(id: number): Observable<void> {
    return this.httpClient.delete<void>(environment.apiUrl + `TaskParents/${id}`)
    .pipe(
        tap({
          next: () => {
            this.emitAssTaskParentsUpdated();
            this.assTaskService.emitAssTasksUpdated();
          }
        })
      );
  }

  /**
   * Toggles a TaskParent's status by Id
   * @param id The Id of the TaskParent to update
   * @returns an Observable that toggle the TaskParent's status
   */
  toggleTaskParentStatus(id: number): Observable<void> {
    return this.httpClient.post<void>(environment.apiUrl + `TaskParents/${id}/ToggleTaskParentActive`, null)
    .pipe(
        tap({
          next: () => {
            this.assTaskService.emitAssTasksUpdated();
          }
        })
      );
  }
}
