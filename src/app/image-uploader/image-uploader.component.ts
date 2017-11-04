import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
    dragging = false;
    loaded = false;
    imageLoaded = false;
    imageSrc = '';
    @Output() fileload: EventEmitter<any> = new EventEmitter();
    @Input() image = '';
    @Input() options = {};
  constructor() {

  }

  ngOnInit() {
      if (this.image) {
          this.imageSrc = this.image;
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
        // this.iconColor = this.overlayColor;
    }

    handleInputChange(e) {
        const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        const pattern = /image-*/;
        const reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        this.loaded = false;

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }

    _handleReaderLoaded(e) {
        const reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
        const input = (<HTMLInputElement> document.getElementById('fileInput'));
        let fileList: FileList = input.files;
        if (fileList.length > 0) {
            this.fileload.emit(fileList[0]);
        }
    }
}
