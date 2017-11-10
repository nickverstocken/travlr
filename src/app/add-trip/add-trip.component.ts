import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
import {Trip} from '../Models/Trip';
import { Router } from '@angular/router';
import {TravlrApiService} from '../services/travlr-api.service';

declare var $: any;

@Component({
    selector: 'app-add-trip',
    templateUrl: './add-trip.component.html',
    styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {
    @Input() trip: any = {};
    @Input() show;
    @Output() closed: EventEmitter<any> = new EventEmitter();
    @Output() newTrip: EventEmitter<any> = new EventEmitter();
    @Output() editedTrip: EventEmitter<any> = new EventEmitter();
    @Output() deletedTrip: EventEmitter<any> = new EventEmitter();
    dateOptions: INgxMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: false
    };
    delete = false;
    error;
    errordate: string;
    start_date: any = {};
    end_date: any = {};
    coverImage: File;
    formData: FormData;
    imageLoaded = false;
    oldTrip;
    uploaderOptions = {width: '100%', height: '150px', 'border-radius': '4px'};
    constructor(private travelrApi: TravlrApiService, private router: Router) {
    }

    ngOnInit() {
        this.oldTrip = JSON.parse(JSON.stringify(this.trip));
        if (this.trip.start_date) {
            this.start_date = {jsdate: new Date(this.trip.start_date)};
        }
        if (this.trip.end_date) {
            this.end_date = {jsdate: new Date(this.trip.end_date)};
        }

    }

    closeModal() {
        this.closed.emit(this.oldTrip);
    }

    addTrip() {
        if (!this.trip.start_date) {
            $('#start_date').addClass('error');
            $('#start_date').attr("placeholder", "Start date is required");
        } else {
            $('#start_date').removeClass('error');
            $('#start_date').attr("placeholder", "Start date*");
            this.travelrApi.addTrip(this.trip).subscribe(
                data => {
                    if (data.success) {
                        this.newTrip.emit(data.trip);
                        this.oldTrip = data.trip;
                    } else {
                        for (var key in data.error) {
                            if (key = 'start_date') {
                                this.errordate = data.error[key];
                            }
                            this.error += data.error[key] + '<br />';
                        }
                    }

                },
                error => {
                    console.log(error);
                }
            );
        }

    }

    cancelDelete() {
        this.delete = false;
    }

    deleteTrip() {
        this.delete = true;
    }
    confirmDelete(trip: Trip) {
        this.travelrApi.deleteTrip(trip).subscribe(
            data => {
               this.deletedTrip.emit(trip);
               this.router.navigate([trip.user_id + '/trips']);
            }
        );
    }
    editTrip(trip: Trip) {
        this.travelrApi.editTrip(trip).subscribe(
            data => {
                if (data.success) {
                    this.editedTrip.emit(trip);
                }
            }
        );
    }
    setSelected(event, value) {
        $('.optionIcon').removeClass('selected');
        $('#' + value + ' .optionIcon').addClass('selected');
        this.trip.privacy = value;
    }

    convertDate(date) {
        if (date.year > 0 && date.month > 0 && date.day > 0) {
            return date.year + '-' + date.month + '-' + date.day;
        } else {
            return null;
        }
    }

    onStartDateChanged($event) {
        this.trip.start_date = this.convertDate($event.date);
    }

    onEndDateChanged($event) {
        this.trip.end_date = this.convertDate($event.date);
    }
    onLoaded(file: File) {
        this.formData = new FormData();
        this.trip.cover_photo_path = file;
        this.formData.append('cover_photo', this.trip.cover_photo_path);
        this.imageLoaded = true;
        this.travelrApi.uploadCoverImage(this.trip, this.formData).subscribe(
            data => {
                if (data.success) {
                    this.trip.cover_photo_path = data.trip.cover_photo_path;
                    this.oldTrip.cover_photo_path = data.trip.cover_photo_path;
                }
            }
        );
    }
}
