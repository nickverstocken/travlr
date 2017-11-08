import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {TravlrApiService} from '../services/travlr-api.service';
import {User} from "../Models/User";
@Component({
  selector: 'app-follows-modal',
  templateUrl: './follows-modal.component.html',
  styleUrls: ['./follows-modal.component.scss']
})
export class FollowsModalComponent implements OnInit {
  @Input() show;
  @Input() title;
  @Input() user;
  users: User[];
  followers: User[];
    @Output() closed: EventEmitter<any> = new EventEmitter();
  constructor(private travelrApi: TravlrApiService) { }

  ngOnInit() {
      console.log(this.user.id);
     this.travelrApi.getFollowers(this.user).subscribe(
         (result) => {
           console.log(result.following.data);
           if(this.title == 'Followers'){
               this.users = result.followers.data;
           }
           if(this.title == 'Following'){
             this.users = result.following.data;
           }
         }
     );
  }
    closeModal(){
    this.closed.emit();
    }

}
