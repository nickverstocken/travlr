import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {User} from '../Models/User';
import {TravlrApiService} from '../services/travlr-api.service';
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
    likes: any[];
  constructor(private travelrApi: TravlrApiService) { }

  ngOnInit() {
      this.likes = this.stop.likes.data;
      this.isLiked();
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
        let exists = this.likes.some(usr => usr.id == this.currentUser.id);
        if(exists){
            this.liked = true;
        }
    }
    likeStop(){
        this.travelrApi.likeStop(this.stop).subscribe(
            result => {
                console.log(result);
                if(this.liked){
                    this.liked = false;
                    this.stop.like_count -=1;
                    this.likes = this.likes.filter(usr => usr.id !== this.currentUser.id);
                }else{
                    this.liked = true;
                    this.stop.like_count +=1;
                    this.likes.unshift(this.currentUser);
                    this.stop.likes.data = this.likes;
                }
            }
        )
    }
}
