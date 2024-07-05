import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIConfig } from '../constants/api.constant';
import { Task } from '../models/task';
import { CreateAssTaskView } from '../models/views/create-asstask-view.model';

@Injectable({
  providedIn: 'root'
})
export class AssTaskService {

  constructor(
    private httpClient: HttpClient
  ) { }

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
    return this.httpClient.get<Task[]>(APIConfig.url + "AssTasks");
  }

  /**
   * Creates a new TaskParent, which generates and returns the next AssTask
   * @returns the created AssTask
   */
  createTask(taskData: CreateAssTaskView): Observable<Task> {
    return this.httpClient.post<Task>(APIConfig.url + "TaskParents/CreateAndGenerateTask", taskData);
  }
}
