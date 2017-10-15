import { Component,Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-tripcard',
  templateUrl: './tripcard.component.html',
  styleUrls: ['./tripcard.component.scss']
})
export class TripcardComponent implements OnInit {
    @Input() stop: any;
    slideConfig = {
      "slidesToShow": 1,
        "slidesToScroll": 1,
        "infinite": true,
        "speed": 300,
        "centerMode": false,
        "variableWidth": false,
        "arrows": true,
        "dots":true
    };
  constructor() { }

  ngOnInit() {

  }

    afterChange(e) {
        console.log('afterChange');
    }
}
