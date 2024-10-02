import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { BaseModalData, CreateEditUserModalData, CreateTaskModalData } from '../models/modal-data';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private createTaskModalSubject = new Subject<CreateTaskModalData>();
  private createEditUserModalSubject = new Subject<CreateEditUserModalData>();
  private completeTaskModalSubject = new Subject<BaseModalData>();
  private manageTasksModalSubject = new Subject<BaseModalData>();
  private manageUsersModalSubject = new Subject<BaseModalData>();

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
   * Create User modal functions
   */
  emitCreateEditUserModalState(modalData: CreateEditUserModalData): void {
    this.createEditUserModalSubject.next(modalData);
  }
  getCreateEditUserModalSubject(): Observable<CreateEditUserModalData> {
    return this.createEditUserModalSubject.asObservable();
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

  /**
   * Manage Users modal functions
   */
  emitManageUsersModalState(modalData: BaseModalData): void {
    this.manageUsersModalSubject.next(modalData);
  }
  getManageUsersModalSubject(): Observable<BaseModalData> {
    return this.manageUsersModalSubject.asObservable();
  }
}
