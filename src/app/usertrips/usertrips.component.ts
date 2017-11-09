import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TravlrApiService } from '../services/travlr-api.service';
import { AuthService } from '../services/auth.service';
import {Trip} from '../Models/Trip';
import {User} from '../Models/User';
@Component({
  selector: 'app-usertrips',
  templateUrl: './usertrips.component.html',
  styleUrls: ['./usertrips.component.scss']
})
export class UsertripsComponent implements OnInit {
  isUser: Boolean;
  trips: Trip[];
  user: User;
  currentUser: User;
  showFollows;
  followsTitle;
  show;
  userFollowers: User[];
  isFollower: Boolean = false;
  constructor(private router: Router, private route: ActivatedRoute, private travelrApi: TravlrApiService, private auth: AuthService) {

  }

  ngOnInit() {
      this.route.params
          .map(params => params['userid'])
          .subscribe((id) => {
              this.travelrApi.getTrips(id)
                  .subscribe(
                      data => {
                        this.user = data;
                        this.trips = data.trips.data;
                          this.auth.currentUser.subscribe(
                              (userData: User) => {
                                  this.currentUser = userData;
                                  if (this.user.id === this.currentUser.id) {
                                      this.isUser = true;
                                  }else{
                                      this.isUser = false;
                                      this.travelrApi.getFollowers(this.user).subscribe(
                                        result => {
                                            this.userFollowers = result.followers.data;
                                            this.isFollower = this.userFollowers.some(usr => usr.id == this.currentUser.id);
                                        }
                                      );
                                  }
                              }
                          );
                  });
          });
  }
    routing(trip: Trip){
        this.router.navigate([trip.user_id + '/trips/' + trip.id]);
    }
    showFollowsModal(action: string){
        this.followsTitle = action;
        this.showFollows = 'show';
    }
    onClosedFollows(){
        this.showFollows = '';
    }
    showModal(action: string) {
        this.show = 'show';
    }
    onClosed() {
        this.show = '';
    }
    onTripAdded(trip) {
        this.onClosed();
        this.trips.unshift(trip);
    }
    onTripDeleted(trip) {
        console.log('trip delete successful');
    }
    userUnfollowed(user){
       this.user.following_count -= 1;
    }
    userFollowed(user){
        this.user.following_count += 1;
    }
    follow(user, event){
        event.stopPropagation();
        this.travelrApi.follow(user).subscribe(
            (result) => {
                this.userFollowers.push(user);
                this.user.followers_count +=1;
                this.isFollower = true;
            }
        );
    }
    unfollow(user){
        this.travelrApi.unFollow(user).subscribe(
            (result) => {
                this.userFollowers = this.userFollowers.filter(usr => usr.id !== user.id);
                this.user.followers_count -=1;
                this.isFollower = false;
            }
        );
    }
}
