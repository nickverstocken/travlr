import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TravlrApiService} from '../services/travlr-api.service';
import {User} from '../Models/User';
import { Router } from '@angular/router';
@Component({
  selector: 'app-follows-modal',
  templateUrl: './follows-modal.component.html',
  styleUrls: ['./follows-modal.component.scss']
})
export class FollowsModalComponent implements OnInit {
  @Input() show;
  @Input() title;
  @Input() user;
  @Input() isUser;
  @Output() followed: EventEmitter<any> = new EventEmitter();
  @Output() unfollowed: EventEmitter<any> = new EventEmitter();
  users: User[];
  following: User[];
  followers: User[];
    @Output() closed: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, private travelrApi: TravlrApiService) { }

  ngOnInit() {
     this.travelrApi.getFollowers(this.user).subscribe(
         (result) => {
           if(this.title == 'Followers'){
               this.following = result.following.data;
               this.users = result.followers.data;
           }
           if(this.title == 'Following'){
             this.following = result.following.data;
             this.users = result.following.data;
           }
         }
     );
  }
    closeModal(){
    this.closed.emit();
    }
    redirect(user: User){
        this.closed.emit();
        this.router.navigate(['/' + user.id + '/trips']);
    }
checkIfFollowBack(user){
        let exists = this.following.some(usr => usr.id == user.id);
     return exists;

}
    unfollow(user, event){
        event.stopPropagation();
        this.travelrApi.follow(user).subscribe(
            (result) => {
                this.following.push(user);
                this.followed.emit(user);
            }
        );
    }
    follow(user, event){
        event.stopPropagation();
        this.travelrApi.unFollow(user).subscribe(
            (result) => {
                this.following = this.following.filter(usr => usr.id !== user.id);
                this.unfollowed.emit(user);
                if(this.title = 'Following'){
                    this.users = this.users.filter(usr => usr.id !== user.id);
                }
            }
        );
    }
}
