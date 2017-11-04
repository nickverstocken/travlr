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
    @Input() tripId;
    @Input() stop: any = {};
    @Input() show;
    @Output() closed: EventEmitter<any> = new EventEmitter();
    @Output() newStop: EventEmitter<any> = new EventEmitter();
    @Output() editedStop: EventEmitter<any> = new EventEmitter();
    @Output() deletedStop: EventEmitter<any> = new EventEmitter();
    @Output() flyToAndAddMarker: EventEmitter<any> = new EventEmitter();
    @Output() deleteTempMarker: EventEmitter<any> = new EventEmitter();
    @Output() imagesAdded: EventEmitter<any> = new EventEmitter();
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
                  this.flyToLocation(place.geometry.location.lat(), place.geometry.location.lng());
                  $('#stopname').val(place.name);
                  this.selectedlocation = place;
                  this.setLocation(place);
                  if(place.geometry === undefined || place.geometry === null ) {
                      return;
                  };
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
  setLocation(place){
      console.log(this.stop);
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
    editStop(stop: Stop) {

    }
    addStop() {
      console.log(this.stop);
        this.formData = new FormData();
        this.formData.append('name', this.stop.name);
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
    deleteStop() {
        this.delete = true;
    }
    confirmDelete(stop: Stop) {

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
                    break;
                case HttpEventType.Response:
                    console.log('😺 Done!', event.body);
                    this.stop.media.data = event.body.stop.media.data;
                    this.imagesAdded.emit(event.body.stop);
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
        console.log(this.stop);
    }
    convertDate(date) {
        if (date.year > 0 && date.month > 0 && date.day > 0) {
            return date.year + '-' + date.month + '-' + date.day;
        } else {
            return null;
        }
    }

}
