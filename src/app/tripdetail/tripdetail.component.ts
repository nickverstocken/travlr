import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {TravlrApiService} from '../services/travlr-api.service';
import {AuthService} from '../services/auth.service';
import {Trip} from '../Models/Trip';
import {User} from '../Models/User';
import {Stop} from '../Models/Stop';
import {MapboxMapComponent} from "../mapbox-map/mapbox-map.component";

declare var $: any;

@Component({
    selector: 'app-tripdetail',
    templateUrl: './tripdetail.component.html',
    styleUrls: ['./tripdetail.component.scss']
})
export class TripdetailComponent implements OnInit {
    stops: Stop[];
    oldid: number = 0;
    mapscroll: boolean = false;
    isUser: Boolean;
    trip: Trip;
    user: User;
    currentUser: User;
    showTripEdit;
    showStopEdit;
    selectedStop: Stop;

    constructor(private travelrApi: TravlrApiService, private router: Router, private route: ActivatedRoute, private auth: AuthService) {
    }

    @ViewChild('map')
    private map: MapboxMapComponent;

    ngOnInit() {
        this.auth.currentUser.subscribe(
            (userData: User) => {
                this.currentUser = userData;
                this.route.params
                    .map(params => params['tripid'])
                    .subscribe((id) => {
                            this.travelrApi.getTrip(id)
                                .subscribe(
                                    data => {
                                        this.trip = data;
                                        this.stops = data.stops.data;
                                        if (this.trip.user.id === this.currentUser.id) {
                                            this.isUser = true;
                                        }
                                    },
                                    error => {
                                        this.router.navigate([this.currentUser.id + '/trips']);
                                    }
                                );
                        });
            });
        if (this.map) {
            console.log(this.map.getTotalDistance());
        }
    }

    action(event) {
        if (!this.mapscroll) {
            if (event.value) {
                var id = event.target.id;
                if (this.oldid != id) {
                    this.highlightMarker(event.target.id);
                    var visiblestop = this.stops.filter(x => x.id == event.target.id);
                    this.map.onscrolledToNewStop(visiblestop);
                    this.oldid = id;
                }

            }

        }
    }

    highlightMarker(trip_id) {

    }

    onMapStopClick(tripid) {
        var scrollTo = $('#' + tripid);
        this.highlightMarker(tripid);
        var scrollContainer = $('.sidepanel-content');
        this.mapscroll = true;
        $('.sidepanel-content').animate({
            scrollTop: scrollTo.offset().top - scrollContainer.offset().top + +scrollContainer.scrollTop() - 13
        }, 500, () => {
            // var visiblestop = this.stops.stops.filter(x => x.id == tripid)
            // this.map.onscrolledToNewStop(visiblestop); -> Zoom in on point now disabled because annoying
            this.mapscroll = false;
        });
    }

    showTripModal() {
        this.showTripEdit = 'show';
    }

    showStopModal() {
        this.showStopEdit = 'show';
    }

    onStopModalClosed() {
        this.showStopEdit = '';
    }

    onTripModalClosed() {
        this.showTripEdit = '';
    }

    onTripDeleted(trip) {

    }

    onTripEdited(trip) {
        this.showTripEdit = '';
    }

    addTempMarker(event) {
        this.map.addTempMarker(event);
    }

    deleteTempMarker() {
        this.map.deleteTempMarker();
        this.onStopModalClosed();
    }

    editStop(stop) {
        this.selectedStop = stop;
        this.showStopModal();
    }

    onStopAdded(stop) {
        this.map.deleteTempMarker();
        const previousStop = this.stops[this.stops.length - 1];
        this.stops.push(stop);
        this.map.addMarker(stop.id, null, [stop.location.lng, stop.location.lat]);
        if (previousStop) {
            this.map.addLine(stop.name + stop.id, [Number(previousStop.location.lng), Number(previousStop.location.lat)], [Number(stop.location.lng), Number(stop.location.lat)]);
        }
        this.trip.total_km = Math.round(this.map.getTotalDistance()).toString();
        //this.onStopModalClosed();
    }
    onImagesAdded(stop){
        this.map.updateMarker(stop.id, stop.media.data[0].image_thumb);
    }
    testfn(){
        this.map.updateMarker(68, null);
    }
    onMapLoaded(bool) {
        if (bool) {
            this.trip.total_km = Math.round(this.map.getTotalDistance()).toString();
        }
    }
}
