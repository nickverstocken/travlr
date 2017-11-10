import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Media} from '../Models/Media';

@Component({
  selector: 'app-images-modal',
  templateUrl: './images-modal.component.html',
  styleUrls: ['./images-modal.component.scss']
})
export class ImagesModalComponent implements OnInit {
  @Input() show = false;
  @Input() selectedMedia: Media;
  @Input() allMedia: Media[];
  @Input() title;
    @Output() closed: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log(this.selectedMedia);
  }
  closeModal(){
    this.closed.emit();
  }
    nextImage(){
        var index = this.allMedia.indexOf(this.selectedMedia);
        if(index >= 0 && index < this.allMedia.length - 1){
            this.selectedMedia = this.allMedia[index + 1];
        }else{
            this.selectedMedia = this.allMedia[0];
        }
    }
}
