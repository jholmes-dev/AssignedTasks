import { map, Observable, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIConfig } from '../constants/api.constant';
import { TaskParent } from '../models/task-parent';

@Injectable({
  providedIn: 'root'
})
export class AssTaskParentService {
  private assTaskParentsUpdated = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient
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
    return this.httpClient.get<TaskParent[]>(APIConfig.url + "TaskParents")
      .pipe(
        map((taskParents: TaskParent[]) => {
          return taskParents.map((taskParent: TaskParent) => {
            taskParent.createdAt = new Date(taskParent.createdAt);
            return taskParent;
          });
        })
      );
  }
}
