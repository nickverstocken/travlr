import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Media} from '../Models/Media';
import {TravlrApiService} from '../services/travlr-api.service';
import { Comment} from '../Models/Comment';
import {User} from '../Models/User';
import {Router} from '@angular/router';
import {Form} from "@angular/forms";
import {AuthService} from "../services/auth.service";
@Component({
  selector: 'app-images-modal',
  templateUrl: './images-modal.component.html',
  styleUrls: ['./images-modal.component.scss']
})
export class ImagesModalComponent implements OnInit {
  @Input() show = false;
  @Input() selectedMedia: Media;
  @Input() allMedia: Media[];
  @Input() title;
  @Input() currentUser: User;
  @Input() isUser;
    @Output() closed: EventEmitter<any> = new EventEmitter();
    comments: Comment[];
    commenttext: string;
  constructor(private travelrApi: TravlrApiService, private auth: AuthService,  private router: Router) { }

  ngOnInit() {
    this.loadComments(this.selectedMedia.id);
  }
  closeModal(){
    this.closed.emit();
  }
    keyUpEvent(event){
        if(event.keyCode == 13 && !event.shiftKey) {
            if(this.commenttext != ''){
                this.addComment();
            }
            return false;
        }
    }
  addComment() {
        const comment: FormData = new FormData;
      comment.append('comment', this.commenttext);
      this.travelrApi.addComment(this.selectedMedia.id, comment).subscribe(
          result => {
              if(result.success){
                  this.comments.push(result.comment);
                  this.commenttext = '';
              }
          }
      );
  }
    deletedComment(comment: Comment){
        this.travelrApi.deleteComment(comment.id).subscribe(
            result => {
                if(result.success){
                    this.comments = this.comments.filter(cmt => cmt.id !== comment.id);
                }
            }
        );
    }
  loadComments(mediaId){
    this.travelrApi.getComments(mediaId).subscribe(
      result => {
        this.comments = result.comments.data;
      }
    );
  }
    nextImage(){
        var index = this.allMedia.indexOf(this.selectedMedia);
        if(index >= 0 && index < this.allMedia.length - 1){
            this.selectedMedia = this.allMedia[index + 1];
            this.loadComments(this.selectedMedia.id);
        }else{
            this.selectedMedia = this.allMedia[0];
            this.loadComments(this.selectedMedia.id);
        }
    }
    redirect(user: User) {
        this.closed.emit();
        this.router.navigate(['/' + user.id + '/trips']);
    }
}
