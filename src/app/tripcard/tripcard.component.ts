import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-tripcard',
  templateUrl: './tripcard.component.html',
  styleUrls: ['./tripcard.component.scss'],
})
export class TripcardComponent implements OnInit {
    @Input() stop: any;
    @Output() editStop: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
      var mySwiper = new Swiper ('.swiper-container', {
          slidesPerView: 1,
          keyboard: {
              enabled: true,
          },
          pagination: {
              el: '.swiper-pagination',
              clickable: true,
          },
          navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
          },
      });
  }

    afterChange(e) {
        console.log('afterChange');
    }
    stopedit(stop){
      this.editStop.emit(stop);
    }
}
