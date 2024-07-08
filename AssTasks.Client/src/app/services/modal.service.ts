import { Observable, of, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { Modals } from '../constants/modals.constant';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private createTaskModalSubject = new Subject<boolean>();
  private completeTaskModalSubject = new Subject<boolean>();

  emitModalState(name: Modals, state: boolean): void {
    switch (name) {
      case Modals.CREATE_TASK:
        this.createTaskModalSubject.next(state);
        break;
      case Modals.COMPLETE_TASK:
        this.completeTaskModalSubject.next(state);
        break;
    }
  }

  getModalSubject(name: Modals): Observable<boolean> {
    switch (name) {
      case Modals.CREATE_TASK:
        return this.createTaskModalSubject.asObservable();
      case Modals.COMPLETE_TASK:
        return this.completeTaskModalSubject.asObservable();
      default:
        return of(false);
    }
  }
}
