import {Component, Input, OnChanges, SimpleChanges, AfterViewInit, OnInit, Output, EventEmitter} from '@angular/core';

declare var $: any;
declare var L: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    @Input() points: any;
    @Output() stopclicked: EventEmitter<any> = new EventEmitter();
    map;
    data = [];
    markers;
    lines;
    photoLayer;
    previouslat;
    previouslng;

    constructor() {
    }

    ngOnInit() {
        L.mapbox.accessToken = 'pk.eyJ1Ijoibmlja3ZlcnN0b2NrZW4iLCJhIjoiY2o4cnhseHhqMDJqYzJxcXU4ZzV3ZW54ayJ9.bnPqSBV_ZuvYuM3NwTkayg';
  /*      this.map = L.map('map', {
            maxZoom: 14
        }).setView([51.505, -0.09], 3);*/
        this.map = L.mapbox.map('map', 'mapbox.satellite')
            .setView([20, 0], 2);
    }

    processPoints(data: any) {
        var photos = [];
        var lat = 0;
        var lng = 0;
        for (var i = 0; i < data.length; i++) {
            var media = data[i].media;
            lat = data[i].location[0].lat;
            lng = data[i].location[0].long;
            for (var j = media.length - 1; j >= 0; j--) {
                photos.push({
                    id: data[i].id,
                    lat: lat,
                    lng: lng,
                    url: media[j].image,
                    caption: media[j].caption,
                    thumbnail: media[j].image,
                    video: (media[j].video ? media[j].video : null)
                });
            }
            if (this.previouslat && this.previouslng) {
              this.lines.push(this.calculateBezier(this.previouslat, this.previouslng, lat, lng));
            }
            this.previouslat = lat;
            this.previouslng = lng;
        }
        this.markers = photos;
        this.photoLayer.add(this.markers).addTo(this.map);

        this.map.flyToBounds(this.photoLayer.getBounds());
        this.map.once('moveend', () => {
            this.connectPoints();
        });
        return photos;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['points']) {
            if (this.points) {
                console.log('jeet');
                this.markers = [];
                this.lines = [];
                this.photoLayer = L.photo.cluster();
                this.photoLayer.on('click', function (evt) {
                    var photo = evt.layer.photo,
                        template = '<img data-tripid="{id}" src="{url}"/></a><p>{caption}</p>';

                    if (photo.video && (!!document.createElement('video').canPlayType('video/mp4; codecs=avc1.42E01E,mp4a.40.2'))) {
                        template = '<video autoplay controls poster="{url}"><source src="{video}" type="video/mp4"/></video>';
                    }

                    evt.layer.bindPopup(L.Util.template(template, photo), {
                        className: 'leaflet-popup-photo',
                        minWidth: 400
                    }).openPopup();
                });
                this.photoLayer.on('clusterclick', (evt) => {
                    if (evt.target) {
                        evt.target.on('spiderfied', (event) => {
                            var el = $(event.cluster._icon.innerHTML);
                            this.stopclicked.emit($($(el)[0]).attr('data-tripid'));
                            event.target.removeEventListener(event.type);
                        });
                    }

                });
                this.processPoints(this.points.stops);
            }
        }
    }
    onscrolledToNewStop(visivlestop: any) {
        var visiblelocation = visivlestop[0].location[0];
        this.map.setView(new L.LatLng(visiblelocation.lat, visiblelocation.long), 11, {
            pan: {animate: true, duration: 0.5},
            zoom: {animate: true},
            animate: true
        });

    }

    setInitialView() {
        this.map.flyToBounds(this.photoLayer.getBounds());
    }

    connectPoints() {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].addTo(this.map);
        }
    }
    calculateBezier(latFrom, lngFrom, latTo, lngTo){
        var offsetX = latFrom - latTo;
        var offsetY = lngFrom - lngTo;
        var r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
        var theta = Math.atan2(offsetY, offsetX);
        var thetaOffset = (3.14 / 10);
        var r2 = (r / 2) / (Math.cos(thetaOffset))
        var theta2 = theta + thetaOffset;
        var midpointX = (r2 * Math.cos(theta2)) + lngFrom;
        var midpointY = (r2 * Math.sin(theta2)) + latFrom;
        var midpointLatLng = [midpointY, midpointX];
        var curvedPath = L.curve(
            [
                'M', [latFrom, lngFrom],
                'Q', midpointLatLng,
                [latTo, lngTo]
            ], {
                dashArray: 5, color: '#2C3E50   ',
                weight: 2
            });
        return curvedPath;
    }
}
