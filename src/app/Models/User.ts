import {Trip} from "./Trip";

export class User {
    id: number;
    first_name: string;
    name: string;
    email: string;
    fb_id: string;
    fb_token: string;
    city: string;
    country: string;
    time_zone: string;
    unit_is_km: boolean;
    temperature_is_celsius: boolean;
    profile_image: string;
    profile_image_cover: string;
    profile_image_thumb: string;
    role: string;
    trips: Trip[];
}