import {User} from './User';

export class Comment {
    id: number;
    media_id: number;
    user: User;
    comment: string;
    date: string;
}