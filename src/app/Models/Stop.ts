import {Location} from './Location';
import {Media} from './Media';
export class Stop {
    id: number;
    name: string;
    description: string;
    trip_id: string;
    views: string;
    likes: string;
    arrival_time: string;
    location: Location;
    media: Media[];
}