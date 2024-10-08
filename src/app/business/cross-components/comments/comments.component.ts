import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';
import { AuthService } from 'src/app/services/auth.service';
import { DateFormatService } from 'src/app/services/date-format.service';
import { CommentsService } from './services/comments.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  providers: [CommentsService]
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
  messageError = 'Ha ocurrido un error al cargar los comentarios. Por favor, inténtalo de nuevo más tarde.';

  get comment() {
    return this._comment;
  }
  get reversedComments() {
    return this.comments.slice().reverse();
  }

  constructor(private fb: FormBuilder, private service: AuthService, private dateFormatService: DateFormatService,
    private commentService: CommentsService, public tokenService: TokenService
  ) {
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
      case eModule.hotbed:
        this.getCommentsByHotbed();
        break;
      case eModule.review:
        this.getCommentsByThesisReview();
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
          });
        break;
      case eModule.hotbed:
        this.service.postAddHotbedComment(this.id, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.registerState = 'complete';
              this.confirmAddEvent(res.id);
            }
            console.log(res);
          }, (error) => {
            this.registerState = 'complete';
          });
        break;
      case eModule.review:
        this.commentService.postAddThesisReviewComment(this.id, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.registerState = 'complete';
              this.confirmAddEvent(res.id);
            }
            console.log(res);
          }, (error) => {
            this.registerState = 'complete';
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
        "id": this.tokenService.getUserTag(),
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

  getCommentsByHotbed() {
    this.state = 'charging';
    this.registerState = 'charging';
    this.service.getCommentsByHotbed(this.id).pipe(takeUntil(this.destroy$)).subscribe(
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

  getCommentsByThesisReview() {
    this.state = 'charging';
    this.registerState = 'charging';
    this.commentService.getCommentsByThesisReview(this.id).pipe(takeUntil(this.destroy$)).subscribe(
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
    this.service.getCommentsByEventsUDI(this.id).pipe(takeUntil(this.destroy$)).subscribe(
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

  handleReload() {
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
      case eModule.hotbed:
        this.getCommentsByHotbed();
        break;
    }
  }

  openMenu(menu: Menu, event: Event) {
    menu.toggle(event);
  }

  commentMenuItems(comment: any): MenuItem[] {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editComment(comment)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.deleteComment(comment)
      },
    ];
  }

  editComment(comment: any) {
    console.log('entra')
    comment.isEditing = true;
    comment.originalDescription = comment.description;
  }

  saveComment(comment: any) {
    console.log('comment', comment)
    switch (this.module) {
      case eModule.eventUdi:
        this.callPutEventUdiCommentUpdate(comment);
        break;
      case eModule.advisory:
        this.callPutAdvisoryCommentUpdate(comment);
        break;
      case eModule.inscription:
        this.callPutInscriptionCommentUpdate(comment);
        break;
      case eModule.hotbed:
        this.callPutArticleCommentUpdate(comment);
        break;
      case eModule.review:
        this.callPutReviewCommentUpdate(comment);
        break;
    }
  }

  cancelEdit(comment: any) {
    comment.description = comment.originalDescription;
    comment.isEditing = false;
  }

  deleteComment(comment: any) {
    switch (this.module) {
      case eModule.eventUdi:
        this.callDeleteEventUdiComment(comment);
        break;
      case eModule.advisory:
        this.callDeleteAdvisoryComment(comment);
        break;
      case eModule.inscription:
        this.callDeleteInscriptionComment(comment);
        break;
      case eModule.hotbed:
        this.callDeleteArticleComment(comment);
        break;
      case eModule.review:
        this.callDeleteReviewComment(comment);
        break;
    }
  }


  callPutInscriptionCommentUpdate(comment: any) {
    const request = {
      description: comment.description
    };
    this.commentService.putInscriptionCommentUpdate(this.id, comment.id, request).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          comment.isEditing = false;
        }, (error) => {

        })
  }

  callPutAdvisoryCommentUpdate(comment: any) {
    const request = {
      description: comment.description
    };
    this.commentService.putAdvisoryCommentUpdate(this.id, comment.id, request).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          comment.isEditing = false;
        }, (error) => {

        })
  }

  callPutReviewCommentUpdate(comment: any) {
    const request = {
      description: comment.description
    };
    this.commentService.putReviewCommentUpdate(this.id, comment.id, request).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          comment.isEditing = false;
        }, (error) => {

        })
  }
  callPutEventUdiCommentUpdate(comment: any) {
    const request = {
      description: comment.description
    };
    this.commentService.putEventUdiCommentUpdate(this.id, comment.id, request).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          comment.isEditing = false;
        }, (error) => {

        })
  }

  callPutArticleCommentUpdate(comment: any) {
    const request = {
      description: comment.description
    };
    this.commentService.putArticleCommentUpdate(this.id, comment.id, request).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          comment.isEditing = false;
        }, (error) => {

        })
  }

  callDeleteArticleComment(comment) {
    this.commentService.deleteArticleComment(this.id, comment.id).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            const commentId = comment.id;
            const index = this.comments.findIndex(comment => comment.id === commentId);
            if (index !== -1) {
              this.comments.splice(index, 1);
              this.comments = [...this.comments];
              this.updateVisibleComments();
            }
          }
        }, (error) => {

        })
  }

  callDeleteInscriptionComment(comment) {
    this.commentService.deleteInscriptionComment(this.id, comment.id).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            const commentId = comment.id;
            const index = this.comments.findIndex(comment => comment.id === commentId);
            if (index !== -1) {
              this.comments.splice(index, 1);
              this.comments = [...this.comments];
              this.updateVisibleComments();
            }
          }
        }, (error) => {

        })
  }

  callDeleteReviewComment(comment) {
    this.commentService.deleteReviewComment(this.id, comment.id).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            const commentId = comment.id;
            const index = this.comments.findIndex(comment => comment.id === commentId);
            if (index !== -1) {
              this.comments.splice(index, 1);
              this.comments = [...this.comments];
              this.updateVisibleComments();
            }
          }
        }, (error) => {

        })
  }

  callDeleteEventUdiComment(comment) {
    this.commentService.deleteEventUdiComment(this.id, comment.id).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            const commentId = comment.id;
            const index = this.comments.findIndex(comment => comment.id === commentId);
            if (index !== -1) {
              this.comments.splice(index, 1);
              this.comments = [...this.comments];
              this.updateVisibleComments();
            }
          }
        }, (error) => {

        })
  }

  callDeleteAdvisoryComment(comment) {
    this.commentService.deleteAdvisoryComment(this.id, comment.id).
      pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            const commentId = comment.id;
            const index = this.comments.findIndex(comment => comment.id === commentId); // Buscar índice por id
            if (index !== -1) {
              this.comments.splice(index, 1); // Eliminar el comentario del array
              this.comments = [...this.comments]; // Crear nueva referencia al array
              this.updateVisibleComments();
            }
          }
        }, (error) => {

        })
  }
}

