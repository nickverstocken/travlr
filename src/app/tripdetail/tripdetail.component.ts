import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {TravlrApiService} from '../services/travlr-api.service';
import {AuthService} from '../services/auth.service';
import {Trip} from '../Models/Trip';
import {User} from '../Models/User';
import {Stop} from '../Models/Stop';
import {MapboxMapComponent} from '../mapbox-map/mapbox-map.component';
import {Media} from '../Models/Media';

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
    showImages;
    selectedMedia: Media;
    allselectedMedia: Media[];
    mediaTitle;
    selectedStop: Stop;
    userFollowers: User[];
    isFollower: Boolean = false;
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
                                        }else{
                                            this.isUser = false;
                                            this.travelrApi.getFollowers(this.trip.user).subscribe(
                                                result => {
                                                    this.userFollowers = result.followers.data;
                                                    this.isFollower = this.userFollowers.some(usr => usr.id == this.currentUser.id);
                                                }
                                            );
                                        }
                                    },
                                    error => {
                                        this.router.navigate([this.currentUser.id + '/trips']);
                                    }
                                );
                        });
            });
        if (this.map) {

        }
    }

    action(event) {
        if (!this.mapscroll) {
            if (event.value) {
                var id = event.target.id;
                if (this.oldid != id) {
                  //  this.highlightMarker(event.target.id);
                    var visiblestop = this.stops.filter(x => x.id == event.target.id);
                    this.map.onscrolledToNewStop(visiblestop);
                    this.oldid = id;
                }

            }

        }
    }



    onMapStopClick(stopId) {
        var scrollTo = $('#' + stopId);
        this.map.highlightMarker(this.stops.filter(x => x.id == stopId)[0]);
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
    showImagesModal(event){
        //event = [media, this.stop]
        this.selectedMedia = event[0];
        this.mediaTitle = event[1].name;
        this.allselectedMedia = event[1].media.data;
        this.showImages = 'show';
    }
    openImagesModal(event){
        this.showImagesModal([event.media.data[0], event]);
    }
    closeImagesModal(){
        this.showImages = '';
    }
    onStopModalClosed(stop) {
        const index = this.stops.indexOf(this.stops.filter(x => x.id == stop.id)[0]);
        if(index >= 0){
            if(!(this.stops[index].location.lat == stop.location.lat && this.stops[index].location.lng == stop.location.lng)){
                this.map.moveMarker(stop,  [stop.location.lng, stop.location.lat]);
            }
            this.stops[index] = stop;
        }
        this.showStopEdit = '';
    }

    onTripModalClosed(trip) {
        this.trip = trip;
        this.showTripEdit = '';
    }

    onTripDeleted(trip) {

    }
    onStopDeleted(stop){
        this.map.removeMarker(stop.id);
        this.stops = this.stops.filter(h => h !== stop);
        this.showStopEdit = '';
    }
    onTripEdited(trip) {
        this.showTripEdit = '';
    }
    onStopEdited(stop){
        this.showStopEdit = '';
    }
    addTempMarker(event) {
        this.map.addTempMarker(event);
    }
    moveMarker(event){
       // event [106.62913040000001, -6.551775799999999, 1]
        this.map.moveMarker(event[2], [event[0], event[1]]);
    }
    deleteTempMarker(stop) {
        this.map.deleteTempMarker();
        this.onStopModalClosed(stop);
    }
    addStop(){
        this.selectedStop = null;
        this.showStopModal();
    }
    editStop(stop) {
        this.selectedStop = stop;
        this.showStopModal();
    }

    onStopAdded(stop) {
        this.map.deleteTempMarker();
        const previousStop = this.stops[this.stops.length - 1];
        this.stops.push(stop);
        if (previousStop) {
            this.map.addLine(stop.id, [Number(previousStop.location.lng), Number(previousStop.location.lat)], [Number(stop.location.lng), Number(stop.location.lat)]);
        }
        this.map.addMarker(stop.id, null, [Number(stop.location.lng), Number(stop.location.lat)]);
        this.trip.total_km = Math.round(this.map.getTotalDistance()).toString();
        //this.onStopModalClosed();
    }
    onImagesAdded(stop){
        this.map.updateMarker(stop);
    }
    onImageDeleted(stop){
        this.map.updateMarker(stop);
    }
    onMapLoaded(bool) {
        if (bool) {
            this.trip.total_km = Math.round(this.map.getTotalDistance()).toString();
        }
    }
}
