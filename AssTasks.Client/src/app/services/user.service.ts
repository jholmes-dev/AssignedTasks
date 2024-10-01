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

  public createUser(userData: User) {
    return this.httpClient.post<User>(APIConfig.url + "Users", userData);
  }

  public getUsers() {}
  public deleteUser() {}
}
