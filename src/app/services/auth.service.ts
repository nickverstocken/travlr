import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
@Injectable()
export class AuthService {
    baseUrl: string;
    headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
  constructor(private http: Http) {
      this.baseUrl = 'http://127.0.0.1:8000/api/v1';
  }
    login(credentials) {
       return this.http.post(this.baseUrl + '/login', credentials)
            .map(res => res.json());
    }
    register(fields) {
        return this.http.post(this.baseUrl + '/register', fields)
            .map(res =>
                res.json()
            );
    }
    loggedIn() {
        return tokenNotExpired();
    }
    logout() {
        localStorage.removeItem('token');
    }
}

