import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ApiService } from './api.service';
import { Trip } from '../Models/Trip';
@Injectable()
export class TravlrApiService {
  baseUrl: string;
    testDataUrl: string;
  constructor(private http: HttpClient,  private apiService: ApiService) {
      this.testDataUrl = '../assets/travlr.json';
  }

    getTrips(id): Observable<any> {
       // http://127.0.0.1:8000/api/v1/user/1?include=trips
        return this.apiService.get(`${'/user/'+ id + '?include=trips:order(start_date|desc)'}`)
            .map(result => result.data);
    }
    getTrip(id): Observable<any> {
        return this.apiService.get(`${'/trips/' + id + '?include=user,stops.media,stops.likes'}`)
            .map(result => result.trip);
    }
    addTrip(trip) {
        return this.apiService.post('/trips', trip);
    }
    editTrip(trip) {
        return this.apiService.post('/trips/update/' + trip.id, trip);
    }
    deleteTrip(trip) {
        return this.apiService.delete('/trips/' + trip.id);
    }
    uploadCoverImage(trip, fields) {
        return this.apiService.post('/trips/cover/' + trip.id, fields);
    }
    addStop(tripid, stop) {
      //trips/1/stops
        return this.apiService.post('/trips/' + tripid + '/stops', stop);
    }
    editStop(stopid, fields){
      return this.apiService.post('/stop/' + stopid, fields);
    }
    deleteStop(stop) {
        return this.apiService.delete('/stop/' + stop.id);
    }
    uploadStopImages(stop, files): Observable<any> {
       return this.apiService.upload('/stop/' + stop.id + '/saveImages', files);
    }
    deleteMedia(media) {
        return this.apiService.delete('/media/' + media.id);
    }
    getFollowers(user) {
        return this.apiService.get('/user/' + user.id + '/getfollowers');
    }
    unFollow(user) {
        return this.apiService.post('/user/' + user.id + '/unfollow');
    }
    follow(user) {
        return this.apiService.post('/user/' + user.id + '/follow');
    }
    getUsers(search) {
        return this.apiService.get('/users?search=' + search);
    }
    likeStop(stop) {
        return this.apiService.post('/stop/like/' + stop.id);
    }
    getComments(mediaId) {
        return this.apiService.get('/comment/' + mediaId);
    }
    addComment(mediaId, comment) {
        return this.apiService.post('/comment/' + mediaId, comment);
    }
    updateUser(fields){
        return this.apiService.post('/user/update', fields);
    }
}
