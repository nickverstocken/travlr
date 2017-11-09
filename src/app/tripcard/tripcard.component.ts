import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {User} from '../Models/User';
declare var $: any;
declare var Swiper: any;
@Component({
  selector: 'app-tripcard',
  templateUrl: './tripcard.component.html',
  styleUrls: ['./tripcard.component.scss'],
})
export class TripcardComponent implements OnInit {
    @Input() stop: any;
    @Input() currentUser: User;
    @Output() editStop: EventEmitter<any> = new EventEmitter();
    liked: Boolean = false;
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
    isLiked(){
        let exists = this.stop.likes.data.some(usr => usr.id == this.currentUser.id);
        if(exists){
            this.liked = true;
        }
        return this.liked;
    }
    processLikes(){

    }
}
