import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { HttpRequest, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class ApiService {
    baseUrl: string;
    constructor( private http: Http, private httpClient: HttpClient ) {
        this.baseUrl = 'http://127.0.0.1:8000/api/v1';
    }

    private setHeaders(): Headers {
        const headersConfig = {

        };

        if (this.getToken()) {
            headersConfig['Authorization'] = `Bearer ${this.getToken()}`;
        }
        return new Headers(headersConfig);
    }


    get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
        return this.http.get(`${this.baseUrl}${path}`, { headers: this.setHeaders(), search: params })
            .map((res: Response) => res.json());
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(
            `${this.baseUrl}${path}`,
            JSON.stringify(body),
            { headers: this.setHeaders() }
        )
            .map((res: Response) => res.json());
    }

    post(path: string, body: Object = {}): Observable<any> {
        return this.http.post(
            `${this.baseUrl}${path}`,
            body,
            { headers: this.setHeaders() }
        )
            .map((res: Response) => res.json());
    }

    delete(path): Observable<any> {
        return this.http.delete(
            `${this.baseUrl}${path}`,
            { headers: this.setHeaders() }
        )
            .map((res: Response) => res.json());
    }
    upload(path: string, body: Object = {}): Observable<any> {
        const req =  new HttpRequest('POST', `${this.baseUrl}${path}`, body, {
            headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken()),
            reportProgress: true,
        });
        return this.httpClient.request(req);
    }
    getToken() {
        if (this.loggedIn()) {
            return localStorage.getItem('token');
        }
    }
    loggedIn() {
        return tokenNotExpired();
    }
}
