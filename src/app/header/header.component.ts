import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import { Router } from '@angular/router';
import {TravlrApiService} from '../services/travlr-api.service';
import { User } from '../Models/User';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;
  users: User[];
    searchvalue;
  searchChanged: Subject<string> = new Subject<string>();
    @ViewChild('search') searchinput;
    @ViewChild('suggestions') suggestions;
  constructor(private auth: AuthService, private router: Router, private travelrApi: TravlrApiService) {
      document.addEventListener('click', this.offClickHandler.bind(this));
  }
    offClickHandler(event:any) {
      if(this.searchinput){
          if (!this.searchinput.nativeElement.contains(event.target)) { // check click origin
              this.suggestions.nativeElement.style.display = "none";
          }
      }

    }
    checkAuth(){
      return this.auth.loggedIn();
    }
    focusSearch(){
        this.suggestions.nativeElement.style.display = "block";
    }
  ngOnInit() {
      this.suggestions.nativeElement.style.display = "none";
      this.auth.currentUser.subscribe(
          (userData) => {
              this.user = userData;
          }
      );
      this.searchChanged
          .debounceTime(300)
          .distinctUntilChanged()
          .subscribe(model => {
              this.searchvalue = model;
              this.getUsers(this.searchvalue);
          });
  }
  getUsers(search){
      this.travelrApi.getUsers(search).subscribe(
          (result) => {
             this.users = result.user.data;
          }
      );
  }
  logout(){
      this.auth.logout();
      this.router.navigate(['/']);
  }
  searchUser(text: string){
    this.searchChanged.next(text);
  }
  redirect(user){
      this.router.navigate(['/' + user.id + '/trips']);
  }
}
