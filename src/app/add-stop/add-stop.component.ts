import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {Stop} from '../Models/Stop';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import { MapsAPILoader } from '@agm/core';
import {} from '@types/googlemaps';
declare var $: any;
import {TravlrApiService} from '../services/travlr-api.service';
import {Form} from "@angular/forms";
@Component({
  selector: 'app-add-stop',
  templateUrl: './add-stop.component.html',
  styleUrls: ['./add-stop.component.scss'],
    providers: [DatePipe]
})
export class AddStopComponent implements OnInit {
    loading = false;
    loadingStatus = '';
    @Input() tripId;
    @Input() stop: any = {};
    @Input() show;
    @Output() closed: EventEmitter<any> = new EventEmitter();
    @Output() newStop: EventEmitter<any> = new EventEmitter();
    @Output() editedStop: EventEmitter<any> = new EventEmitter();
    @Output() deletedStop: EventEmitter<any> = new EventEmitter();
    @Output() flyToAndAddMarker: EventEmitter<any> = new EventEmitter();
    @Output() flyToAndMoveMarker: EventEmitter<any> = new EventEmitter();
    @Output() deleteTempMarker: EventEmitter<any> = new EventEmitter();
    @Output() imagesAdded: EventEmitter<any> = new EventEmitter();
    @Output() imageDeleted: EventEmitter<any> = new EventEmitter();
    delete = false;
    @ViewChild('search') public searchElement: ElementRef;
    stop_date: any = {};
    stop_time;
    selectedlocation;
    dateOptions: INgxMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: false
    };
    formData: FormData;
    uploaderOptions = {width: '80px', height: '80px', 'border-radius': '4px'};
  constructor(private mapsAPILoader: MapsAPILoader, private travelrApi: TravlrApiService, private datePipe: DatePipe) { }

  ngOnInit() {

      this.mapsAPILoader.load().then(
          data => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types:[] });
              autocomplete.addListener("place_changed", () => {
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  $('#stopname').val(place.name);
                  if(this.stop.location){
                      this.setLocation(place);
                      this.moveLocation(place);
                  }else{
                      this.selectedlocation = place;
                      this.setLocation(place);
                      this.flyToLocation(place.geometry.location.lat(), place.geometry.location.lng());
                  }

                  if(place.geometry === undefined || place.geometry === null ) {
                      return;
                  }
              });
          }
          );
      if (this.stop.arrival_time) {
          this.stop_date = {jsdate: new Date(this.stop.arrival_time)};
      }else{
          this.stop_date = {jsdate: new Date()};
          this.stop.arrival_time = this.datePipe.transform(new Date(), 'yyyy-MM-dd hh:mm');
      }
  }
  moveLocation(place) {
      //this.stop.location.lat = place.geometry.location.lat();
      //this.stop.location.lng = place.geometry.location.lng();
      this.flyToAndMoveMarker.emit([place.geometry.location.lng(), place.geometry.location.lat(), this.stop]);
  }
  setLocation(place){
      if(!this.stop.location){
          this.stop.location = {};
      }
      this.stop.name = place.name;
      this.stop.location.name = place.formatted_address;
      this.stop.location.lat = place.geometry.location.lat();
      this.stop.location.lng = place.geometry.location.lng();
  }
  flyToLocation(lat,lng){
      this.flyToAndAddMarker.emit([lng, lat]);
  }

    addStop() {
        this.formData = new FormData();
        this.formData.append('name', this.stop.name);
        this.formData.append('description', this.stop.description);
        this.formData.append('location', this.stop.location.name);
        this.formData.append('lat', this.stop.location.lat);
        this.formData.append('lng', this.stop.location.lng);
        this.formData.append('arrival_time', this.stop.arrival_time);
        this.travelrApi.addStop(this.tripId, this.formData).subscribe(
            data => {
                if (data.success) {
                    this.stop = data.stop;
                    this.newStop.emit(data.stop);
                } else {
                    for (var key in data.error) {
                        console.log(data.error[key]);
                    }
                }

            },
            error => {
                console.log(error);
            }
        );
    }
    editStop(){
        this.formData = new FormData();
        this.formData.append('name', this.stop.name);
        this.formData.append('description', this.stop.description);
        this.formData.append('location', this.stop.location.name);
        this.formData.append('lat', this.stop.location.lat);
        this.formData.append('lng', this.stop.location.lng);
        this.formData.append('arrival_time', this.stop.arrival_time);
        this.travelrApi.editStop(this.stop.id, this.formData).subscribe(
            data => {
                if (data.success) {
                    this.stop = data.stop;
                   this.editedStop.emit(this.stop);
                } else {
                    for (var key in data.error) {
                        console.log(data.error[key]);
                    }
                }

            },
            error => {
                console.log(error);
            }
        );
    }
    deleteStop() {
        this.delete = true;
    }
    confirmDelete(stop: Stop) {
        this.travelrApi.deleteStop(stop).subscribe(
            data => {
                this.deletedStop.emit(stop);
            }
        );
    }
    filesLoaded(files: FileList){
        this.formData = new FormData();
        let fileCount: number = files.length;
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                this.formData.append('images[]', files[i]);
            }
        }
        this.travelrApi.uploadStopImages(this.stop, this.formData).subscribe((event: HttpEvent<any>) => {
            // Via this API, you get access to the raw event stream.
            // Look for upload progress events.
            switch (event.type) {
                case HttpEventType.Sent:
                    console.log('Request sent!');
                    this.loading = true;
                    this.loadingStatus = 'Sending data';
                    break;
                case HttpEventType.ResponseHeader:
                    console.log('Response header received!');
                    break;
                case HttpEventType.DownloadProgress:
                    const kbLoaded = Math.round(event.loaded / 1024);
                    console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
                    break;
                case HttpEventType.UploadProgress:
                    const percentDone = Math.round(100 * event.loaded / event.total);
                    console.log(`File is ${percentDone}% uploaded.`);
                    this.loadingStatus = 'Uploading data';
                    break;
                case HttpEventType.Response:
                    this.loadingStatus = '';
                    this.loading = false;
                    this.stop = event.body.stop;
                    this.imagesAdded.emit(this.stop);
            }
        });
    }
    cancelDelete() {
        this.delete = false;
    }
    closeModal() {
        this.closed.emit();
    }
    cancelStop() {
      this.deleteTempMarker.emit();
    }
    onArrivalDateChanged($event){
        this.stop.arrival_time = this.convertDate($event.date);
    }
    convertDate(date) {
        if (date.year > 0 && date.month > 0 && date.day > 0) {
            return date.year + '-' + date.month + '-' + date.day;
        } else {
            return null;
        }
    }
    onRemovefile(file){
       let deleteMedia = this.stop.media.data.filter(x => x.image_thumb == file)[0];
        this.stop.media.data = this.stop.media.data.filter(item => item !== deleteMedia);
        this.travelrApi.deleteMedia(deleteMedia).subscribe(
            data => {
                this.imageDeleted.emit(this.stop);
            }
        );
    }
}
