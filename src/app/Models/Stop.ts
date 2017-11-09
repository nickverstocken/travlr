import {Location} from './Location';
import {Media} from './Media';
import { User } from './User';
export class Stop {
    id: number;
    name: string;
    description: string;
    trip_id: string;
    views: string;
    likes: User[];
    arrival_time: string;
    location: Location;
    media: Media[];
}