import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comments = [];

  commentsForm: FormGroup;
  tasksForm: FormGroup;
  _comment: FormControl = new FormControl('', [Validators.required]);
  visibleComments = [];
  showAllComments = false;

  get comment() {
    return this._comment;
  }
  get reversedComments() {
    return this.comments.slice().reverse();
  }

  constructor(private fb: FormBuilder) {
    this.commentsForm = this.fb.group({
      comment: this.comment,
    });
  }

  ngOnInit() {
    this.updateVisibleComments();
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
          name: 'Gary Velarde',
          content: this.comment.value,
          isComment: true,
        });
        this.comment.setValue('');
        this.comment.reset();
        this.updateVisibleComments();
      }
    }
  }
}
