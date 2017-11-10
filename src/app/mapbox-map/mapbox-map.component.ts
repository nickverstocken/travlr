import {Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { DatePipe } from '@angular/common';
import * as mapboxgl from 'mapbox-gl';
import * as turf from 'turf';
import {environment} from '../../environments/environment';
import {Stop} from '../Models/Stop';

declare var $: any;
@Component({
    selector: 'app-mapbox-map',
    templateUrl: './mapbox-map.component.html',
    styleUrls: ['./mapbox-map.component.scss'],
    providers : [DatePipe],
    encapsulation: ViewEncapsulation.None,
})
export class MapboxMapComponent implements OnInit {
    map: mapboxgl.Map;
    style = 'mapbox://styles/nickverstocken/cj8xhikuq9u5k2rqungpomm2f';
    style2 = 'mapbox://styles/mapbox/bright-v9'
    lat = 0;
    lng = 0;
    coordinates = [];
    @Input() stops: Stop[];
    @Output() mapLoaded: EventEmitter<any> = new EventEmitter();
    @Output() stopclicked: EventEmitter<any> = new EventEmitter();
    @Output() popupclicked: EventEmitter<any> = new EventEmitter();
    totalDistance = 0;
    midPoint;
    previousCoordinates;
    lines = {
        "type": "FeatureCollection",
        "features": []
    };
    labels = {
        "type": "FeatureCollection",
        "features": []
    };
    constructor(private datePipe: DatePipe) {
        mapboxgl.accessToken = environment.mapbox.accessToken
    }

    ngOnInit() {
        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 2,
            maxZoom: 16,
            center: [this.lng, this.lat]
        });


            this.map.on('load', () => {
                if (this.stops) {
                this.map.addSource('lines', {
                    type: 'geojson',
                    data: this.lines
                });
                this.map.addSource('labels', {
                    type: 'geojson',
                    data: this.labels
                });
                this.map.addLayer({
                    'id': 'lines',
                    'type': 'line',
                    'source': 'lines',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#2C3E50',
                        'line-width': 1,
                        'line-dasharray': [3, 5],
                    },
                });
                this.map.addLayer({
                        "id": "labels",
                        "type": "symbol",
                        "source": "labels",
                        "layout": {
                            "text-font": ["Open Sans Regular"],
                            "text-field": '{title}', // part 2 of this is how to do it
                            "text-size": 12,

                            "text-offset": [0.6, -0.6],
                        },
                        "paint": {
                            "text-color": "#2C3E50",
                            "text-halo-color": "#fff",
                            "text-halo-width": 1
                        }
                    });
                this.createStops(this.stops);
                var bounds = this.coordinates.reduce(function (bounds, coord) {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(this.coordinates[0], this.coordinates[0]));
                if(bounds._ne){
                    this.map.fitBounds(bounds, {
                        padding: 50,
                    });
                }
                this.map.on('click', (evt) => {
                    $('.mapboxgl-popup').remove();
                });
            this.mapLoaded.emit(true);
            }
            });


    }
    
    createStops(stops: any) {
        for (let i = 0; i < stops.length; i++) {
            const media = stops[i].media.data;
            let lat, lng;
            lat = stops[i].location.lat;
            lng = stops[i].location.lng;
            this.addMarker(stops[i].id, media[0] , [Number(lng), Number(lat)], media.length, stops[i]);
            if (this.previousCoordinates) {
                this.addLine(stops[i].id, this.previousCoordinates, [lng, lat]);
            }
            this.previousCoordinates = [lng, lat];
        }
        console.log(this.labels);
        this.map.getSource('labels').setData(this.labels);
        this.map.getSource('lines').setData(this.lines);
    }

    createMarker(stopid, image, lnglat, imageCount?) {
        const el = document.createElement('div');
        el.className = 'marker';
        if (image) {

            el.style.backgroundImage = 'url(' + image.image_thumb + ')';
            el.style.width = 30 + 'px';
            el.style.height = 30 + 'px';
        } else {
            el.className += ' no-image';
            el.style.backgroundColor = '#2C3E50';
            el.style.width = 15 + 'px';
            el.style.height = 15 + 'px';
        }
        el.id = stopid;
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';
        if(imageCount){
            el.setAttribute('data-imgTotal', imageCount);
        }

        el.setAttribute('data-stopid', stopid);
        el.setAttribute('lat', lnglat[1]);
        el.setAttribute('lng', lnglat[0]);
        $(el).on('click', (evt) => {
            evt.stopPropagation();
            const element = <HTMLDivElement> evt.target;
            this.stopclicked.emit(element.getAttribute('data-stopid'));
            this.flyTo([element.getAttribute('lng'), element.getAttribute('lat')], 7);
        });
        return el;
    }
    highlightMarker(stop){
        $('.mapboxgl-popup').remove();
        var popup = new mapboxgl.Popup({closeOnClick: false})
            .setLngLat([stop.location.lng, stop.location.lat])
            .setHTML(this.createPopup(stop).innerHTML)
            .addTo(this.map);
        $('.mapboxgl-popup').on('click', (evt) => {
            if(stop.media.data.length > 0){
                this.popupclicked.emit(stop);
            }
        });
    }
    createPopup(stop){
        const el = document.createElement('div');
        el.className = 'popup';
        if(stop.media.data.length > 0){
            el.innerHTML = '<div class="images"><img class="poster" src="' + stop.media.data[0].image + '" /></div>';
        }
        el.setAttribute('data-stopid', stop.id);
        el.innerHTML +=
            '<div class="content-wrap"><div class="title"><h1>' + stop.name + '</h1></div>' +
            '<div class="arrival-time">' + this.datePipe.transform(stop.arrival_time, 'fullDate') + '</div>' +
            '<div class="title"><h2>' + stop.location.name + '</h2></div></div>';

        return el;
    }
    updateMarker(stop){
        let el = $('.marker[data-stopid=' + stop.id + ']');
        if(stop.media.data[0]){
            el[0].className = 'marker';
            $(el).width(30);
            $(el).height(30);
            $(el).css('background-image', 'url(' + stop.media.data[0].image_thumb + ')');
            el[0].setAttribute('data-imgTotal', stop.media.data.length);
        }else{
            el[0].className += ' no-image';
            el[0].style.backgroundColor = '#2C3E50';
            $(el).css('background-image', 'none');
            $(el).width(15);
            $(el).height(15);
            el[0].setAttribute('data-imgTotal', 0);
        }

    }
    addMarker(stopid, image, lnglat, imgCount?, stop?) {
        this.coordinates[stopid] = lnglat;
        new mapboxgl.Marker(this.createMarker(stopid, image, lnglat, imgCount))
            .setLngLat(lnglat)
            //.setPopup(popup)
            .addTo(this.map);
        this.map.getSource('labels').setData(this.labels);
        this.map.getSource('lines').setData(this.lines);
    }
    removeMarker(stopid){
        let el = $('.marker[data-stopid=' + stopid + ']');
        $('.marker[data-stopid=' + stopid + ']').remove();
        this.coordinates.splice(stopid, 1);
        this.redrawLines();
    }
    moveMarker(stop, lnglat){
        if(!stop.id){
            stop.id = 0;
        }
        let el = $('.marker[data-stopid=' + stop.id + ']');
        $('.marker[data-stopid=' + stop.id + ']').remove();
        el[0].setAttribute('lat', lnglat[1]);
        el[0].setAttribute('lng', lnglat[0]);
        $(el).on('click', (evt) => {
            evt.stopPropagation();
            const element = <HTMLDivElement> evt.target;
            this.stopclicked.emit(element.getAttribute('data-stopid'));
            this.flyTo([element.getAttribute('lng'), element.getAttribute('lat')], 7);
        });
        this.coordinates[stop.id] = lnglat;
        new mapboxgl.Marker(el[0])
            .setLngLat(lnglat)
            .addTo(this.map);
        if(stop.id != 0){
            this.redrawLines();
        }

        this.flyTo(lnglat, this.map.getZoom());
    }
    redrawLines(){
        this.lines = {
            "type": "FeatureCollection",
            "features": []
        };
        this.labels = {
            "type": "FeatureCollection",
            "features": []
        };
        this.previousCoordinates = null;
        Object.entries(this.coordinates).forEach(
            ([key, value]) => {
                if(this.previousCoordinates){
                    this.addLine(key, this.previousCoordinates, value);
                }
                this.previousCoordinates = value;
            }
        );
        this.map.getSource('lines').setData(this.lines);
        this.map.getSource('labels').setData(this.labels);
    }
    flyTo(coordinates: Object, zoom: number) {

        setTimeout(() => {
            this.map.flyTo({center: coordinates, zoom: zoom});
        }, 100);
    }

    addLine(stopid, origin: number[], destination: number[]) {
        const from = turf.point(origin);
        const to = turf.point(destination);
        const midpoint = turf.midpoint(from, to);
        const line = turf.lineString([origin, destination]);
        const lineDistance = turf.lineDistance(line, 'kilometers');
        this.totalDistance += lineDistance;
        let angle = 10;
        const new_point = this.getPerpendicularPoint(midpoint.geometry.coordinates, origin, angle);
        this.midPoint = turf.point(new_point);
        this.midPoint.properties.title = parseFloat(lineDistance).toFixed(1) + ' km';
        this.labels.features.push(this.midPoint);
        const curved = this.getCurvedLine(origin, new_point, destination);
        this.lines.features.push(curved);
    }
    getTotalDistance(){
        return this.totalDistance;
    }
    getPerpendicularPoint(point1, point2, angle) {
        let [x1, y1] = point1;
        let [x2, y2] = point2;

        // Calculate gradient
        const m = (y2 - y1) / (x2 -  x1);

        // Convert intended degree into radian
        const angle_rad = Math.tan(angle * Math.PI / 180);


        const new_y = (angle_rad * (x2 - x1)) + y1;
        const new_x = x1 - (m * ( new_y - y1));

        return [new_x, new_y];
    }

    getCurvedLine(origin, mid_point, destination) {

        const line = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': [
                    origin,
                    mid_point,
                    destination
                ],
            },
            'properties': {}
        };
        return turf.bezier(line, 20000, 1);
    }
    onscrolledToNewStop(visiblestop){
      this.flyTo([visiblestop[0].location.lng, visiblestop[0].location.lat], 8);
    }
    addTempMarker(event){
        const el = document.getElementById('0');
        if(el){
            el.parentNode.removeChild(el);
        }
        this.addMarker(0, null, event);
        this.flyTo(event, 9);
    }
    deleteTempMarker(){
        const el = document.getElementById('0');
        if(el){
            el.parentNode.removeChild(el);
        }

    }
}
