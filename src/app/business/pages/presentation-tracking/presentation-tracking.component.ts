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
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';
import { TokenService } from 'src/app/services/token.service';

@Component({
    templateUrl: './presentation-tracking.component.html',
    styleUrls: ['./presentation-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PresentationTrackingComponent implements OnInit, OnDestroy {
    @ViewChild('fileList') fileList: FileListComponent;
    @ViewChild('upload') upload: UploadArchivesComponent;
    @ViewChild('comments') comments: CommentsComponent;
    @ViewChild('reviewerSelection') reviewerSelection: UserSelectionComponent;

    chargingEdition = false;
    private destroy$ = new Subject<void>();
    products: any[] = [];
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Sustentación de tesis', visible: true },
    ];
    detailBreadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Sustentación de tesis', },
        { label: 'Detalle de sustentación', visible: true },
    ];
    rowsPerPageOptions = [5, 10, 20];
    registros = [];
    getStatusList = '';
    reviewerType = userType.teacher;
    studentType = userType.student;
    showDialogAddFiles = false;
    commentsVisible = true;
    showDialogCancel = false;
    edition = false;
    module = eModule.presentation;
    presentationState = '';
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Título del tesis',
        'Revisor',
        'Estado',
        ''
    ];
    optionsConfirmationJury = [
        { name: 'Pendiente', code: 'Pendiente' },
        { name: 'Confirmado', code: 'Confirmado' },
    ]
    categories = [
        { name: 'Si', key: true },
        { name: 'No', key: false },
    ]
    isUdi = this.tokenService.userIsUDI();
    lastReviewerSelected = [];
    formData = new FormData();
    presentationSelected: any;
    getStudentListProcess = '';
    alertForCancelation: Message[] | undefined;
    messageError: string = 'Lo sentimos, hubo un problema al intentar cargar la lista de revisiones de tesis. Por favor, inténtelo de nuevo más tarde. Si el inconveniente persiste, contacte al soporte técnico.';
    messageMoreInfo = [{ severity: 'info', detail: 'Es necesario completar todos los campos faltantes para continuar con la sustentación.' }];
    requiereMoreInfo: boolean = false;
    showDateReceived: boolean = false;
    showDateSentToLibrary: boolean = false;
    public tasksForm: FormGroup;
    public cancelattionForm: FormGroup;
    public reviewerForm: FormGroup;
    public studentForm: FormGroup;
    public moreInfoForm: FormGroup;
    public editForm: FormGroup;
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _jury: FormControl = new FormControl([], [Validators.required]);
    private _students: FormControl = new FormControl([], [Validators.required]);
    private _receptionDateFaculty: FormControl = new FormControl("", [Validators.required]);
    private _scheduledDate: FormControl = new FormControl("", [Validators.required]);
    private _notificationDateGraduates: FormControl = new FormControl("");
    private _juryConfirmation: FormControl = new FormControl("", [Validators.required]);
    private _place: FormControl = new FormControl("", [Validators.required]);
    private _formRequestDateRepository: FormControl = new FormControl("", [Validators.required]);
    private _received: FormControl = new FormControl(false, [Validators.required]);
    private _sentToLibrary: FormControl = new FormControl(false, [Validators.required]);
    private _dateRecivied: FormControl = new FormControl(null);
    private _dateSentToLibrary: FormControl = new FormControl(null);

    get cancelationComment() {
        return this._cancelationComment;
    }
    get dateCancelationReception() {
        return this._dateCancelationReception;
    }
    get taskDescription() {
        return this._taskDescription;
    }
    get jury() {
        return this._jury;
    }
    get students() {
        return this._students;
    }
    get receptionDateFaculty() {
        return this._receptionDateFaculty;
    }
    get scheduledDate() {
        return this._scheduledDate;
    }
    get notificationDateGraduates() {
        return this._notificationDateGraduates;
    }
    get juryConfirmation() {
        return this._juryConfirmation;
    }
    get place() {
        return this._place;
    }
    get formRequestDateRepository() {
        return this._formRequestDateRepository;
    }
    get received() {
        return this._received;
    }
    get sentToLibrary() {
        return this._sentToLibrary;
    }
    get dateRecivied() {
        return this._dateRecivied;
    }
    get dateSentToLibrary() {
        return this._dateSentToLibrary;
    }

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private router: Router,
        private config: PrimeNGConfig,
        private loaderService: LoaderService,
        private dateFormatService: DateFormatService,
        private tokenService: TokenService,
    ) {
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
        this.cancelattionForm = this.fb.group({
            cancelationComment: this.cancelationComment,
        });
        this.reviewerForm = this.fb.group({
            reviewer: this.jury,
        });
        this.studentForm = this.fb.group({
            students: this.students,
        });
        this.moreInfoForm = this.fb.group({
            receptionDateFaculty: this.receptionDateFaculty,
            scheduledDate: this.scheduledDate,
            notificationDateGraduates: this.notificationDateGraduates,
            juryConfirmation: this.juryConfirmation,
            place: this.place,
            formRequestDateRepository: this.formRequestDateRepository,
            received: this.received,
            sentToLibrary: this.sentToLibrary,
            dateRecivied: this.dateRecivied,
            dateSentToLibrary: this.dateSentToLibrary,
        });
        this.editForm = this.fb.group({
            receptionDateFaculty: this.receptionDateFaculty,
            scheduledDate: this.scheduledDate,
            notificationDateGraduates: this.notificationDateGraduates,
            juryConfirmation: this.juryConfirmation,
            place: this.place,
            formRequestDateRepository: this.formRequestDateRepository,
            received: this.received,
            sentToLibrary: this.sentToLibrary,
            dateRecivied: this.dateRecivied,
            dateSentToLibrary: this.dateSentToLibrary,
        });
    }

    ngOnInit() {
        this.getPresentationList();
        this.watchReceived();
        this.watchSentToLibrary();
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

    getPresentationList() {
        this.getStatusList = 'charging';
        this.service.getPresentationList().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
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
    }


    viewDetailsReview(data: any) {
        this.loaderService.show();
        if (data) {
            data.juries.length < 1
                ? this.requiereMoreInfo = true
                : this.requiereMoreInfo = false;
            this.presentationSelected = data;
            this.chargingEdition = false;
            this.presentationState = this.presentationSelected.status;
            this.presentationState === 'Aprobado' || this.presentationState === 'Renuncia'
                ? this.commentsVisible = false
                : this.commentsVisible = true
            this.students.setValue(data.degree_processes.graduates);
            this.jury.setValue(data.juries);
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    backList() {
        this.loaderService.show();
        this.getPresentationList();
        this.presentationSelected = null;
        this.edition = false;
        this.editForm.reset();
        this.students.setValue([]);
        this.jury.setValue([]);
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    getFirstLetter(str: string): string {
        if (!str) {
            return '';
        }
        const firstLetter = str.charAt(0);
        const firstLetterUpper = firstLetter.toUpperCase();
        return firstLetterUpper;
    }

    getTeacherSelected(userSelected: any) {
        this.jury.setValue(userSelected);
    }

    getStudentSelected(userSelected: any) {
        this.students.setValue(userSelected);
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.getPresentationList();
        }
    }

    saveMoreInfo() {
        this.loaderService.show(true);
        const request = {
            juries: this.extractIds(this.jury.value),
            place: this.place.value,
            scheduled_date: this.dateFormatService.transformDDMMYYYY(this.scheduledDate.value),
            reception_date_faculty: this.dateFormatService.transformDDMMYYYY(this.receptionDateFaculty.value),
            notification_date_graduates: this.dateFormatService.transformDDMMYYYY(this.notificationDateGraduates.value),
            jury_confirmation: this.juryConfirmation.value.code,
            form_request_date_repository: this.dateFormatService.transformDDMMYYYY(this.formRequestDateRepository.value),
            received: this.dateRecivied.value ? this.dateFormatService.transformDDMMYYYY(this.dateRecivied.value) : null,
            sent_to_library: this.dateSentToLibrary.value ? this.dateFormatService.transformDDMMYYYY(this.dateSentToLibrary.value) : null,
        }
        this.service.putPresentationUpdate(this.presentationSelected.id, request).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.presentationSelectedUpdate();
                    this.requiereMoreInfo = false;
                    this.presentationState = 'Pendiente';
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
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

    presentationSelectedUpdate(): void {
        this.presentationSelected.reviewer = this.jury.value;
        this.presentationSelected.reception_date_faculty = this.dateFormatService.transformDDMMYYYY(this.receptionDateFaculty.value);
        this.presentationSelected.scheduled_date = this.dateFormatService.transformDDMMYYYY(this.scheduledDate.value);
        this.presentationSelected.notification_date_graduates = this.dateFormatService.transformDDMMYYYY(this.notificationDateGraduates.value);
        this.presentationSelected.jury_confirmation = this.juryConfirmation.value.code;
        this.presentationSelected.place = this.place.value;
        this.presentationSelected.form_request_date_repository = this.dateFormatService.transformDDMMYYYY(this.formRequestDateRepository.value);
        this.presentationSelected.received = this.dateFormatService.transformDDMMYYYY(this.dateRecivied.value);
        this.presentationSelected.sent_to_library = this.dateFormatService.transformDDMMYYYY(this.dateSentToLibrary.value);
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
        this.service.postRegisterThesisReviewFile(this.formData, this.presentationSelected.id).pipe(
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

    showEdition() {
        this.fillEditForm();
        this.lastReviewerSelected = this.jury.value;
        this.edition = true;
    }

    cancelEdition() {
        this.jury.setValue(this.lastReviewerSelected);
        this.reviewerSelection.userFormControl.setValue(this.lastReviewerSelected);
        this.edition = false;
    }

    saveEdition() {
        this.chargingEdition = true;
        const request = {
            juries: this.extractIds(this.jury.value), //ID jurados
            place: this.place.value,
            scheduled_date: this.dateFormatService.transformDDMMYYYY(this.scheduledDate.value),
            reception_date_faculty: this.dateFormatService.transformDDMMYYYY(this.receptionDateFaculty.value),
            notification_date_graduates: this.dateFormatService.transformDDMMYYYY(this.notificationDateGraduates.value),
            jury_confirmation: this.juryConfirmation.value.code,
            form_request_date_repository: this.dateFormatService.transformDDMMYYYY(this.formRequestDateRepository.value),
            received: this.dateRecivied.value ? this.dateFormatService.transformDDMMYYYY(this.dateRecivied.value) : null,
            sent_to_library: this.dateSentToLibrary.value ? this.dateFormatService.transformDDMMYYYY(this.dateSentToLibrary.value) : null,
        }
        this.service.putPresentationUpdate(this.presentationSelected.id, request).pipe(
            finalize(() => {
                this.chargingEdition = false;
            })
        ).
            subscribe((res: any) => {
                if (res.status) {
                    this.presentationSelectedUpdate();
                    this.edition = false;
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'Se actualizó la información.',
                        life: 3000,
                    });
                }
            }, () => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al guardar la información.',
                    life: 3000,
                });
            })
    }

    extractIds(arr: Array<{ id: string }>): string[] {
        return arr.map(item => item.id);
    }

    callPutPresentationUpdateStatus(status: string) {
        const rq = {
            status: status
        }
        this.service.putPresentationUpdateStatus(this.presentationSelected.id, rq).pipe().subscribe(
            (res: any) => {
                if (res.status) {
                    
                    const isFirstPresentation = this.isFirstPresentation();
                    if(isFirstPresentation) {
                        this.presentationState = status === 'No aprobado' ? 'En proceso' : 'Culminado';
                        this.presentationSelected.first_presentation = status;
                        this.presentationSelected.second_presentation = 'En proceso';
                    } else {
                        this.presentationState = status === 'No aprobado' ? 'No aprobado' : 'Culminado';
                        this.presentationSelected.second_presentation = status;
                    }
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

    goToDisapproved() {
        this.callPutPresentationUpdateStatus('No aprobado');
    }

    goToApprove() {
        this.callPutPresentationUpdateStatus('Aprobado');
    }

    getJurorNames(juries: Array<{ name: string, surnames: string }>): string {
        return juries.slice(0, 3)
            .map(jury => `${jury.name} ${jury.surnames}`)
            .join(', ');
    }

    fillEditForm() {
        this.receptionDateFaculty.setValue(this.presentationSelected.reception_date_faculty);
        this.scheduledDate.setValue(this.presentationSelected.scheduled_date);
        this.notificationDateGraduates.setValue(this.presentationSelected.notification_date_graduates);
        this.juryConfirmation.setValue({ code: this.presentationSelected.jury_confirmation, name: this.presentationSelected.jury_confirmation });
        this.place.setValue(this.presentationSelected.place);
        this.formRequestDateRepository.setValue(this.presentationSelected.form_request_date_repository);
        // this.received.setValue(this.presentationSelected.received === 1 ? true : false);
        // this.sentToLibrary.setValue(this.presentationSelected.sent_to_library === 1 ? true : false);
        this.dateRecivied.setValue(this.presentationSelected.received)
        this.dateSentToLibrary.setValue(this.presentationSelected.sent_to_library)
    }

    isFirstPresentation(): boolean {
        return this.presentationSelected.first_presentation === 'Pendiente'
            || this.presentationSelected.first_presentation !== 'No aprobado'
            ? true : false;
    }

    watchReceived(): void {
        this.received.valueChanges.pipe().subscribe(
            (data) => {
                this.showDateReceived = data.key
            }
        )
    }

    watchSentToLibrary(): void {
        this.sentToLibrary.valueChanges.pipe().subscribe(
            (data) => {
                this.showDateSentToLibrary = data.key
            }
        )
    }
}
