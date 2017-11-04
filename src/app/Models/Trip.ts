import {Stop} from './Stop';
import {User} from './User';

export class Trip {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    total_km: string;
    cover_photo_path: string;
    creation_time: string;
    last_modified: string;
    likes: string;
    privacy: boolean;
    user_id: boolean;
    profile_image: string;
    profile_image_cover: string;
    profile_image_thumb: string;
    role: string;
    stops: Stop[];
    user: User;
}