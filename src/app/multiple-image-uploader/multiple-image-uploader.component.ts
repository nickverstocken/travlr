import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-multiple-image-uploader',
  templateUrl: './multiple-image-uploader.component.html',
  styleUrls: ['./multiple-image-uploader.component.scss']
})
export class MultipleImageUploaderComponent implements OnInit {
    dragging = false;
    loaded = false;
    imageLoaded = false;
    @Output() fileload: EventEmitter<any> = new EventEmitter();
    @Output() removeFile: EventEmitter<any> = new EventEmitter();
    @Input() images = [];
    imageSrc = [];
    @Input() options = {};
    loadCount = 0;
  constructor() { }

    ngOnInit() {
        if(this.images){
            for(let image of this.images){
                this.imageSrc.push(image.image_thumb);
            }
        }
    }
    handleDragEnter() {
        this.dragging = true;
    }

    handleDragLeave() {
        this.dragging = false;
    }

    handleDrop(e) {
        e.preventDefault();
        this.dragging = false;
       this.handleInputChange(e);
    }

    handleImageLoad() {
        this.imageLoaded = true;
    }
    removeImage(image){
      this.removeFile.emit(image);
        this.imageSrc = this.imageSrc.filter(item => item !== image);
    }
    handleInputChange(e) {

        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        const pattern = /image-*/;
        const length = files.length;
        Object.keys(files).forEach(i => {
            const file = files[i];
            const reader = new FileReader();
            if (!file.type.match(pattern)) {
                alert('invalid format');
                return;
            }
            this.loaded = false;
            reader.onload = (e) => {
                this.imageSrc.push(reader.result);
                this.loadCount += 1;
                if(this.loadCount !== length){
                   // console.log(this.loadCount);
                }else{
                    this.fileload.emit(files);
                }
            }
            reader.readAsDataURL(file);
        });
    }
    mouseEnter(){
        this.dragging = true;
    }
    mouseLeave(){
        this.dragging = false;
    }
}
