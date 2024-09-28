import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatService } from 'src/app/services/date-format.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() module: eModule;
  @Input() id: string;
  @Input() disabled: boolean = false;
  @Input() visible: boolean = true;

  private destroy$ = new Subject<void>();
  comments = [];
  skeletonLength = [1, 2, 3];
  commentsForm: FormGroup;
  tasksForm: FormGroup;
  _comment: FormControl = new FormControl('', [Validators.required]);
  visibleComments = [];
  showAllComments = false;
  state = '';
  registerState = '';

  get comment() {
    return this._comment;
  }
  get reversedComments() {
    return this.comments.slice().reverse();
  }

  constructor(private fb: FormBuilder, private service: AuthService, private dateFormatService: DateFormatService) {
    this.commentsForm = this.fb.group({
      comment: this.comment,
    });
  }

  ngOnInit() {
    console.log(this.disabled)
    if (this.disabled) {
      this.comment.disable();
    }
    this.getCommentsList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCommentsList() {
    switch (this.module) {
      case eModule.eventUdi:
        this.getCommentsByEventsUDI();
        break;
      case eModule.advisory:
        this.getCommentsByAdvisory();
        break;
      case eModule.inscription:
        this.getCommentsByInscription();
        break;
    }
  }

  getInitialName(): string {
    const userName = JSON.parse(localStorage.getItem('dr2lp2'));
    return userName === null ? '-' : this.getFirstLetter(userName.user.name);
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
      ? this.comments
      : this.comments.slice(0, 5);
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
        const rq = {
          description: this.comment.value
        }
        this.registerComment(rq);
      }
    }
  }

  registerComment(rq: any) {
    this.registerState = 'charging';
    switch (this.module) {
      case eModule.eventUdi:
        this.service.postAddEventsUdiComment(this.id, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.registerState = 'complete';
              this.confirmAddEvent(res.id);
            }

            console.log(res);
          }, (error) => {
            this.registerState = 'complete';
            console.log(error);
          });
        break;
      case eModule.inscription:
        this.service.postAddInscriptionComment(this.id, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.registerState = 'complete';
              this.confirmAddEvent(res.id);
            }

            console.log(res);
          }, (error) => {
            this.registerState = 'complete';
            console.log(error);
          });
        break;
      case eModule.advisory:
        this.service.postAddAdvisoryComment(this.id, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.registerState = 'complete';
              this.confirmAddEvent(res.id);
            }

            console.log(res);
          }, (error) => {
            this.registerState = 'complete';
            console.log(error);
          });
        break;
    }
  }

  confirmAddEvent(idComment: number) {
    const userName = JSON.parse(localStorage.getItem('dr2lp2'));
    this.comments.unshift({
      id: idComment,
      description: this.comment.value,
      status: "",
      shipment_date_secretary: "00-00-0000",
      created_at: this.dateFormatService.formatCustomDateByFrontComment(new Date()),
      user: {
        "id": 1,
        "name": userName.user.name,
        "surnames": userName.user.surnames
      }
    });
    this.comment.setValue('');
    this.comment.reset();
    this.updateVisibleComments();
  }

  getCommentsByInscription() {
    this.state = 'charging';
    this.registerState = 'charging';
    this.service.getCommentsByInscription(this.id).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        res.data.forEach(item => {
          item.created_at = this.dateFormatService.formatCustomDateByFrontComment(item.created_at);
        });
        this.comments = res.data;
        this.updateVisibleComments();
        this.state = 'complete';
        this.registerState = 'complete';
      },
      (error) => {
        this.state = 'error';
        this.registerState = 'complete';
      })
  }

  getCommentsByAdvisory() {
    this.state = 'charging';
    this.registerState = 'charging';
    this.service.getCommentsByAdvisory(this.id).pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        res.data.forEach(item => {
          item.created_at = this.dateFormatService.formatCustomDateByFrontComment(item.created_at);
        });
        this.comments = res.data;
        this.updateVisibleComments();
        this.state = 'complete';
        this.registerState = 'complete';
      },
      (error) => {
        this.state = 'error';
        this.registerState = 'complete';
      })
  }

  getCommentsByEventsUDI() {
    this.state = 'charging';
    this.registerState = 'charging';
    this.service.getCommentsByEventsUDI(this.id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      res.data.forEach(item => {
        item.created_at = this.dateFormatService.formatCustomDateByFrontComment(item.created_at);
      });
      this.comments = res.data;
      this.updateVisibleComments();
      this.state = 'complete';
      this.registerState = 'complete';
    },
      (error) => {
        this.state = 'error';
        this.registerState = 'complete';
      })
  }
}
