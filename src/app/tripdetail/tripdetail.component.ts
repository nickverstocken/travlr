import {Component, OnInit, ViewChild} from '@angular/core';
import {TravlrApiService} from '../services/travlr-api.service';
import {MapComponent} from "../map/map.component";


declare var $: any;

@Component({
    selector: 'app-tripdetail',
    templateUrl: './tripdetail.component.html',
    styleUrls: ['./tripdetail.component.scss']
})
export class TripdetailComponent implements OnInit {
    stops: any;
    oldid: number = 0;
    mapscroll: boolean = false;
    constructor(private _api: TravlrApiService) {
    }
    @ViewChild('map')
    private map: MapComponent;
    ngOnInit() {
        this._api.fetchentries()
            .subscribe(
                data => {
                    this.stops = data;

                },
                error => console.log('Error fetching stories'),
                () => {
                }
            );
    }

    action(event) {
        if(!this.mapscroll){
            if (event.value) {
                var id = event.target.id;
                if (this.oldid != id) {
                    this.highlightMarker(event.target.id);
                    var visiblestop = this.stops.stops.filter(x => x.id == event.target.id);
                    this.map.onscrolledToNewStop(visiblestop);
                    this.oldid = id;
                }

            }

        }

    }
    highlightMarker(trip_id){
        console.log(trip_id);
    }
    onMapStopClick(tripid){
        var scrollTo = $('#' + tripid);
        this.highlightMarker(tripid);
        var scrollContainer = $('.sidepanel-content');
        this.mapscroll = true;
        $('.sidepanel-content').animate({
            scrollTop: scrollTo.offset().top - scrollContainer.offset().top + + scrollContainer.scrollTop() - 13
        },500, () => {
           // var visiblestop = this.stops.stops.filter(x => x.id == tripid)
           // this.map.onscrolledToNewStop(visiblestop); -> Zoom in on point now disabled because annoying
            this.mapscroll = false;
        });

    }
}
