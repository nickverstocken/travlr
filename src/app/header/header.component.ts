import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;
  constructor(private auth: AuthService, private router: Router) {

  }

  ngOnInit() {
      this.auth.currentUser.subscribe(
          (userData) => {
              this.user = userData;
          }
      );
  }
  parseUser(){

  }
  logout(){
      this.auth.logout();
      this.router.navigate(['/']);
  }
}
