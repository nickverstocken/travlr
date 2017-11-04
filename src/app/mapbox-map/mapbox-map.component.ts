import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as turf from 'turf';
import {environment} from '../../environments/environment';
import {Stop} from '../Models/Stop';

declare var $: any;
@Component({
    selector: 'app-mapbox-map',
    templateUrl: './mapbox-map.component.html',
    styleUrls: ['./mapbox-map.component.scss']
})
export class MapboxMapComponent implements OnInit {
    map: mapboxgl.Map;
    style2 = 'mapbox://styles/nickverstocken/cj8xhikuq9u5k2rqungpomm2f';
    style = 'mapbox://styles/mapbox/bright-v9'
    lat = 0;
    lng = 0;
    coordinates = [];
    @Input() stops: Stop[];
    @Output() mapLoaded: EventEmitter<any> = new EventEmitter();
    @Output() stopclicked: EventEmitter<any> = new EventEmitter();
    midPoint;
    totalDistance = 0;
    previousCoordinates;
    lines = {
        "type": "FeatureCollection",
        "features": []
    };
    constructor() {
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
        if (this.stops) {
            this.map.on('load', () => {
                this.map.addSource('lines', {
                    type: 'geojson',
                    data: this.lines
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
                        'line-color': 'gray',
                        'line-width': 1,
                        'line-dasharray': [3, 5],
                    }
                });
                this.createStops(this.stops);
                var bounds = this.coordinates.reduce(function (bounds, coord) {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(this.coordinates[0], this.coordinates[0]));
                if(bounds._ne){
                    this.map.fitBounds(bounds, {
                        padding: 50
                    });
                }
            this.mapLoaded.emit(true);
            });

        }
    }
    
    createStops(stops: any) {
        for (let i = 0; i < stops.length; i++) {
            const media = stops[i].media.data;
            let lat, lng;
            lat = stops[i].location.lat;
            lng = stops[i].location.lng;
            this.coordinates.push([lng, lat]);
            this.addMarker(stops[i].id, media[0] , [lng, lat]);
            if (this.previousCoordinates) {
                this.addLine(stops[i].name + stops[i].id, this.previousCoordinates, [lng, lat]);
            }
            this.previousCoordinates = [lng, lat];
        }
    }


    createMarker(stopid, image, lnglat) {
        const el = document.createElement('div');
        el.className = 'marker';
        if (image) {
            el.style.backgroundImage = 'url(' + image.image + ')';
            el.style.width = 30 + 'px';
            el.style.height = 30 + 'px';
        } else {
            el.style.backgroundColor = '#2C3E50';
            el.style.width = 15 + 'px';
            el.style.height = 15 + 'px';
        }
        el.id = stopid;
        el.style.backgroundSize = 'cover';
        el.style.backgroundRepeat = 'no-repeat';

        el.setAttribute('data-stopid', stopid);
        el.setAttribute('lat', lnglat[1]);
        el.setAttribute('lng', lnglat[0]);
        $(el).on('click', (evt) => {
            const element = <HTMLDivElement> evt.target;
            this.stopclicked.emit(element.getAttribute('data-stopid'));
            this.flyTo([element.getAttribute('lng'), element.getAttribute('lat')], 7);
        });
        return el;
    }
    updateMarker(stopid, image){
        let el = $('.marker[data-stopid=' + stopid + ']');
        $(el).width(30);
        $(el).height(30);
        $(el).css('background-image', 'url(' + image + ')')

    }
    addMarker(stopid, image, lnglat) {
        new mapboxgl.Marker(this.createMarker(stopid, image, lnglat))
            .setLngLat(lnglat)
            .addTo(this.map);
    }

    flyTo(coordinates: Object, zoom: number) {

        setTimeout(() => {
            this.map.flyTo({center: coordinates, zoom: zoom});
        }, 100);
    }

    addLine(name, origin: number[], destination: number[]) {
        const from = turf.point(origin);
        const to = turf.point(destination);
        const midpoint = turf.midpoint(from, to);
        const line = turf.lineString([origin, destination]);
        const lineDistance = turf.lineDistance(line, 'kilometers');
        this.totalDistance += lineDistance;
        let angle = 10;
        const new_point = this.getPerpendicularPoint(midpoint.geometry.coordinates, origin, angle);
        const curved = this.getCurvedLine(origin, new_point, destination);
        this.lines.features.push(curved);
        this.map.getSource('lines').setData(this.lines);
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
                ]
            }
        };
/*        this.midPoint = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': mid_point
                }
            }]
        };*/

        return turf.bezier(line, 20000, 1);
    }
    onscrolledToNewStop(visiblestop){
      this.flyTo([visiblestop[0].location.lng, visiblestop[0].location.lat], 7);
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
