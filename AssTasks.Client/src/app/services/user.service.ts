import { Observable, Subject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUpdated = new Subject<boolean>();

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * Watcher method for receiving notifications that the User list has been updated
   * @returns A watchable that emits when the User list updates
   */
  watchUsers(): Observable<boolean> {
    return this.usersUpdated.asObservable();
  }

  /**
   * Emitter method for when the list of User is updated
   */
  emitUsersUpdated(): void {
    this.usersUpdated.next(true);
  }

  /**
   * Creates a User
   * @param userData The User data
   * @returns The created User
   */
  public createUser(userData: User): Observable<User> {
    return this.httpClient.post<User>(environment.apiUrl + "Users", userData);
  }

  /**
   * Returns a list of all Users
   * @returns A list of existing Users
   */
  public getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiUrl + "Users");
  }

  public updateUser(user: User): Observable<void> {
    return this.httpClient.put<void>(environment.apiUrl + `Users/${user.id}`, user)
      .pipe(
        tap({
          next: () => {
            this.emitUsersUpdated();
          }
        })
      );
  }

  /**
   * Deletes a User
   * @param user The User to delete
   */
  public deleteUser(user: User): Observable<void> {
    return this.httpClient.delete<void>(environment.apiUrl + `Users/${user.id}`)
      .pipe(
        tap({
          next: () => {
            this.emitUsersUpdated();
          }
        })
      );
  }
}
