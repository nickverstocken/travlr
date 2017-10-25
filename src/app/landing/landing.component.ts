import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  scrollTo(elementId: string){
    console.log(elementId);
      $("html, body").animate({ scrollTop: $(elementId).offset().top }, 500);
  }
}
