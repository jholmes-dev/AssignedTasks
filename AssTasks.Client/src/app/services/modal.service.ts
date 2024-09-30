import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { BaseModalData, CreateTaskModalData } from '../models/modal-data';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private createTaskModalSubject = new Subject<CreateTaskModalData>();
  private completeTaskModalSubject = new Subject<BaseModalData>();
  private manageTasksModalSubject = new Subject<BaseModalData>();

  /**
   * Create task modal functions
   */
  emitCreateTaskModalState(modalData: CreateTaskModalData): void {
    this.createTaskModalSubject.next(modalData);
  }
  getCreateTaskModalSubject(): Observable<CreateTaskModalData> {
    return this.createTaskModalSubject.asObservable();
  }

  /**
   * Complete task modal functions
   */
  emitCompleteTaskModalState(modalData: BaseModalData): void {
    this.completeTaskModalSubject.next(modalData);
  }
  getCompleteTaskModalSubject(): Observable<BaseModalData> {
    return this.completeTaskModalSubject.asObservable();
  }

  /**
   * Manage tasks modal functions
   */
  emitManageTasksModalState(modalData: BaseModalData): void {
    this.manageTasksModalSubject.next(modalData);
  }
  getManageTasksModalSubject(): Observable<BaseModalData> {
    return this.manageTasksModalSubject.asObservable();
  }
}
