import { Component,Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import {User} from '../Models/User';
import {TravlrApiService} from '../services/travlr-api.service';
import { NgxCarousel } from 'ngx-carousel';
import {Media} from '../Models/Media';
declare var $: any;
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
    carouselOne: NgxCarousel;
    @Output() showImagesModal: EventEmitter<any> = new EventEmitter();
  constructor(private travelrApi: TravlrApiService) { }

  ngOnInit() {
      this.likes = this.stop.likes.data;
      this.isLiked();
      this.carouselOne = {
          grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
          slide: 1,
          point: {
              visible: true
          },
          load: 2,
          touch: true,
          loop: true,
          custom: 'banner'
  };
  }

    afterChange(e) {
        console.log('afterChange');
    }
    stopedit(stop) {
      this.editStop.emit(stop);
    }
    isLiked() {
        let exists = this.likes.some(usr => usr.id == this.currentUser.id);
        if (exists) {
            this.liked = true;
        }
    }
    likeStop(){
        this.travelrApi.likeStop(this.stop).subscribe(
            result => {
                if (this.liked) {
                    this.liked = false;
                    this.stop.like_count -= 1;
                    this.likes = this.likes.filter(usr => usr.id !== this.currentUser.id);
                }else{
                    this.liked = true;
                    this.stop.like_count += 1;
                    this.likes.unshift(this.currentUser);
                    this.stop.likes.data = this.likes;
                }
            }
        )
    }
    openImagesModal(media: Media){
        this.showImagesModal.emit([media, this.stop]);
    }
}
