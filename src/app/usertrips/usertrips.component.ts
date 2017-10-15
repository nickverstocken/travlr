import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-usertrips',
  templateUrl: './usertrips.component.html',
  styleUrls: ['./usertrips.component.scss']
})
export class UsertripsComponent implements OnInit {

  constructor(private _router: Router) {

  }
    routing(){
        this._router.navigate(['/trips/1']);
    }
  ngOnInit() {
  }

}
