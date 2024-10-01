import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIConfig } from '../constants/api.constant';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient
  ) {}

  /**
   * Creates a User
   * @param userData The User data 
   * @returns The created User
   */
  public createUser(userData: User): Observable<User> {
    return this.httpClient.post<User>(APIConfig.url + "Users", userData);
  }

  /**
   * Returns a list of all Users
   * @returns A list of existing Users
   */
  public getUsers() {
    return this.httpClient.get<User[]>(APIConfig.url + "Users");
  }

  public deleteUser() {}
}
