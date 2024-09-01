import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() module: string;
  @Input() id: number;

  comments = [];
  skeletonLength = [1,2,3];
  commentsForm: FormGroup;
  tasksForm: FormGroup;
  _comment: FormControl = new FormControl('', [Validators.required]);
  visibleComments = [];
  showAllComments = false;
  state = '';

  get comment() {
    return this._comment;
  }
  get reversedComments() {
    console.log(this.comments)
    return this.comments.slice().reverse();
  }

  constructor(private fb: FormBuilder, private service: AuthService) {
    this.commentsForm = this.fb.group({
      comment: this.comment,
    });
  }

  ngOnInit() {
    switch (this.module) {
      case 'reuniones-udi':
        this.getCommentsByEventsUDI();
        break;
      case 'asesorias':
        this.getCommentsByAdvisory();
        break;
      case 'inscripciones':
        this.getCommentsByInscription();
        break;
    }
  }

  getFirstLetter(str: string): string {
    if (!str) {
      console.error('The string is empty');
      return '';
    }
    const firstLetter = str.charAt(0);
    const firstLetterUpper = firstLetter.toUpperCase();
    return firstLetterUpper;
  }

  updateVisibleComments() {
    this.visibleComments = this.showAllComments
      ? this.reversedComments
      : this.reversedComments.slice(0, 5);
  }

  showAll() {
    this.showAllComments = true;
    this.updateVisibleComments();
  }

  showLess() {
    this.showAllComments = false;
    this.updateVisibleComments();
  }

  addComment(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.comment.value) {
        this.comments.push({
          description: this.comment.value,
          status: "",
          shipment_date_secretary: "00-00-0000",
          created_at: new Date(),
          user: {
            "id": 1,
            "name": "Cesar",
            "surnames": "Jauregui"
          }
        });
        this.comment.setValue('');
        this.comment.reset();
        this.updateVisibleComments();
      }
    }
  }

  getCommentsByInscription() {
    this.state = 'charging';
    this.service.getCommentsByInscription(this.id).pipe().subscribe(
      (res: any) => {
        this.comments = res.data;
        this.updateVisibleComments();
        this.state = 'complete';
      },
      (error) => {
        this.state = 'error';
      })
  }

  getCommentsByAdvisory() {
    this.state = 'charging';
    this.service.getCommentsByAdvisory(this.id).pipe().subscribe(
      (res: any) => {
      this.comments = res.data;
      this.updateVisibleComments();
      this.state = 'complete';
    },
    (error) => {
      this.state = 'error';
    })
  }

  getCommentsByEventsUDI() {
    this.state = 'charging';
    this.service.getCommentsByEventsUDI(this.id).pipe().subscribe((res: any) => {
      this.comments = res.data;
      this.updateVisibleComments();
      this.state = 'complete';
    },
    (error) => {
      this.state = 'error';
    })
  }
}
