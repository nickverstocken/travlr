import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
@Injectable()
export class TravlrApiService {
  baseUrl: string;
  constructor(private http: Http) {
      this.baseUrl = '../assets/travlr.json';
      var baseUrl2 = 'https://picasaweb.google.com/data/feed/api/user/118196887774002693676/albumid/6052628080819524545?alt=json';
  }
    fetchentries(): Observable<any> {
        return this.http.get(`${this.baseUrl}`)
            .map(response => response.json());
    }
}
