import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DateFormatService } from 'src/app/services/date-format.service';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { UploadArchivesComponent } from '../../cross-components/upload-archives/upload-archives.component';
import { FileListComponent } from '../../cross-components/file-list/file-list.component';
import { CommentsComponent } from '../../cross-components/comments/comments.component';

@Component({
    templateUrl: './thesis-review-tracking.component.html',
    styleUrls: ['./thesis-review-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class ThesisReviewTrackingComponent implements OnInit, OnDestroy {
    @ViewChild('fileList') fileList: FileListComponent;
    @ViewChild('upload') upload: UploadArchivesComponent;
    @ViewChild('comments') comments: CommentsComponent;

    private destroy$ = new Subject<void>();
    products: any[] = [];
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Revisión de tesis', visible: true },
    ];
    detailBreadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Revisión de tesis', },
        { label: 'Detalle de revisión', visible: true },
    ];
    rowsPerPageOptions = [5, 10, 20];
    registros = [];
    getStatusList = '';
    reviewerType = userType.teacher;
    studentType = userType.student;
    showDialogAddFiles = false;
    reloadFiles = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
    showEditSudents = false;
    commentsVisible = true;
    showDialogCancel = false;
    module = eModule.review;
    reviewState = '';
    filteredReviewers: any;
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Título del tesis',
        'Revisor',
        'Estado',
        ''
    ];
    selectedProducts: any[] = [];
    formData = new FormData();
    reviewSelected: any;
    titleModalDetailIserSelected: string = '';
    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    studentsList = [];
    alertForCancelation: Message[] | undefined;
    messageError: string = 'Lo sentimos, hubo un problema al intentar cargar la lista de revisiones de tesis. Por favor, inténtelo de nuevo más tarde. Si el inconveniente persiste, contacte al soporte técnico.';
    messageMoreInfo = [{ severity: 'info', detail: 'Es necesario completar todos los campos faltantes para continuar con la asesoría.' }];
    requiereMoreInfo: boolean = false;
    public tasksForm: FormGroup;
    public cancelattionForm: FormGroup;
    public reviewerForm: FormGroup;
    public studentForm: FormGroup;
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _reviewer: FormControl = new FormControl([], [Validators.required]);
    private _students: FormControl = new FormControl([], [Validators.required]);

    get cancelationComment() {
        return this._cancelationComment;
    }
    get dateCancelationReception() {
        return this._dateCancelationReception;
    }
    get taskDescription() {
        return this._taskDescription;
    }
    get reviewer() {
        return this._reviewer;
    }
    get students() {
        return this._students;
    }

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private router: Router,
        private config: PrimeNGConfig,
        private loaderService: LoaderService,
        private dateFormatService: DateFormatService
    ) {
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
        this.cancelattionForm = this.fb.group({
            cancelationComment: this.cancelationComment,
        });
        this.reviewerForm = this.fb.group({
            reviewer: this.reviewer,
        });
        this.studentForm = this.fb.group({
            students: this.students,
        });
    }

    ngOnInit() {
        this.getThesisReviewList();
        this.config.setTranslation({
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Sm'
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getThesisReviewList() {
        this.getStatusList = 'charging';
        this.service.getThesisReviewList().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                console.log(res);
                this.registros = res.data;
                this.getStatusList = 'complete'
            }, (error) => {
                this.getStatusList = 'error';
            })
    }

    goToInscription() {
        this.router.navigate(['/pages/new-titulation-process']);
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
        console.log(table.filterGlobal)
    }


    viewDetailsReview(data: any) {
        this.loaderService.show();
        if (data) {
            data.reviewer.length < 1
                ? this.requiereMoreInfo = true
                : this.requiereMoreInfo = false;
            this.reviewSelected = data;

            console.log('this.reviewSelected', this.reviewSelected)
            this.reviewState = this.reviewSelected.status;
            this.reviewState === 'Aprobado' || this.reviewState === 'Renuncia'
                ? this.commentsVisible = false
                : this.commentsVisible = true
            this.students.setValue(data.degree_processes.graduates);
            this.reviewer.setValue(data.reviewer);
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    backList() {
        this.loaderService.show();
        this.getThesisReviewList();
        this.reviewSelected = null;
        this.students.setValue([]);
        this.reviewer.setValue([]);
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    goToCancelation() {
        this.showDialogCancel = true;
        this.alertForCancelation = [
            { severity: 'warn', detail: 'Recuerda que una vez cancelada la asesoría no se podrá reabrir.' },
        ];
    }

    confirmCancelation() {
        this.showDialogCancel = false;
        this.loaderService.show();
        const rq = {
            status: 'No aprobado',
            description: this.cancelationComment.value,
        }
        this.service.putReviewStatusUpdate(this.reviewSelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.reviewState = 'No aprobado';
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Conformación',
                        detail: 'Se realizó la desaprobación de la asesoría.',
                        life: 3000,
                    });
                    this.comments.getCommentsList();
                    this.commentsVisible = false
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al actualizar el estado.',
                    life: 3000,
                });
            });
    }

    hideCancelDialog() {
        this.showDialogCancel = false;
    }

    goToApprove() {
        this.confirmationService.confirm({
            header: 'Aprobado',
            message:
                'Estás a punto de aprobar esta revisión de tesis, ¿estás seguro(a)?.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.loaderService.show();
                const rq = {
                    status: 'Aprobado',
                }
                this.service.putReviewStatusUpdate(this.reviewSelected.id, rq).pipe(
                    finalize(() => {
                        this.loaderService.hide();
                    }), takeUntil(this.destroy$)
                ).subscribe(
                    (res: any) => {
                        if (res.status) {
                            this.reviewState = 'Aprobado';
                            this.messageService.add({
                                key: 'tst',
                                severity: 'info',
                                summary: 'Conformación',
                                detail: 'Se ha realizado la aprobación de la revisión de tesis.',
                                life: 3000,
                            });
                            this.commentsVisible = false
                        }
                    }, (error) => {
                        this.messageService.add({
                            key: 'tst',
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Se ha producido un error al actualizar el estado.',
                            life: 3000,
                        });
                    });
            },
            reject: () => { },
        });
    }


    formatText(text: string): string {
        return text.replace(/\n/g, '<br>');
    }

    scrollDown(): void {
        window.scroll({
            top: document.body.scrollHeight,
            left: 0,
            behavior: 'smooth',
        });
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

    getTeacherSelected(userSelected: any) {
        this.reviewer.setValue(userSelected);
    }

    getStudentSelected(userSelected: any) {
        this.students.setValue(userSelected);
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.getThesisReviewList();
        }
    }

    saveMoreInfo() {
        this.loaderService.show(true);
        const rq = {
            user_id: this.reviewer.value[0].id,
        }
        this.service.putReviewUpdate(this.reviewSelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.reviewerSelectedUpdate();
                    this.requiereMoreInfo = false;
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmado',
                        detail: 'Lo datos han sido guardados.',
                        life: 3000,
                    });
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al guardar la información.',
                    life: 3000,
                });
            })
    }

    reviewerSelectedUpdate(): void {
        this.reviewSelected.reviewer = this.reviewer.value;
    }

    onFileChange(files: any) {
        this.formData = files;
    }

    clearFile() {
        this.formData = new FormData();
    }

    hideAddFilesDialog() {
        this.clearFile();
        this.upload.clearFile();
        this.showDialogAddFiles = false;
    }

    showDialogAddFile() {
        this.clearFile();
        this.upload.clearFile();
        this.showDialogAddFiles = true;
    }

    saveFiles() {
        this.loaderService.show(true);
        this.showDialogAddFiles = false;
        this.service.postRegisterReviewFile(this.formData, this.reviewSelected.id).pipe(
            finalize(() => {
                this.upload.clearFile()
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.fileList.callGetFileList();
                    this.clearFile();
                    this.hideAddFilesDialog();
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'Los archivos han sido guardados.',
                        life: 3000,
                    });
                }
            }, (error) => {
                this.clearFile();
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al guardar los archivos.',
                    life: 3000,
                });
            });
    }

    isFormDataEmpty(formData: FormData): boolean {
        return !(formData as any).entries().next().done;
    }

}
