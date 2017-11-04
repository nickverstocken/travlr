import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ApiService } from './api.service';
import { User } from '../Models/User';
import 'rxjs/add/operator/distinctUntilChanged';
@Injectable()
export class AuthService {
    baseUrl = 'http://127.0.0.1:8000/api/v1';
    headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    private currentUserSubject = new BehaviorSubject<User>(new User());
    public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private http: Http, private apiService: ApiService) {

  }

    populate() {
        if (this.apiService.loggedIn()) {
            this.apiService.get('/currentUser')
                .subscribe(
                    data => {
                        this.setAuth(data.user);
                    },
                    err => this.logout()
                );
        } else {
            this.logout();
        }
    }
    login(credentials) {
       return this.apiService.post('/login', credentials);
    }
    register(fields) {
        return this.apiService.post('/register', fields);
    }
    setAuth(user: User) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUserSubject.next(new User());
        this.isAuthenticatedSubject.next(false);
    }
    loggedIn() {
      return this.apiService.loggedIn();
    }

}

