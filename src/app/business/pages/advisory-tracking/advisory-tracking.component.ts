import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
    templateUrl: './advisory-tracking.component.html',
    styleUrls: ['./advisory-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AdvisoryTrackingComponent implements OnInit, OnDestroy {
    @ViewChild('upload') upload: UploadArchivesComponent;
    @ViewChild('fileList') fileList : FileListComponent;

    private destroy$ = new Subject<void>();
    products: any[] = [];
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Asesorías', visible: true },
    ];
    detailBreadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Asesorías', },
        { label: 'Detalle de asesoría', visible: true },
    ];
    rowsPerPageOptions = [5, 10, 20];
    registros = [];
    getStatusList = '';
    comments = [
        {
            name: 'John Doe',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            isComment: true,
        },
        {
            name: 'Alice Smith',
            content:
                'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            isComment: true,
        },
    ];
    reviewerType = userType.teacher;
    studentType = userType.student;
    showDialogCancel = false;
    showDialogAddFiles = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
    showEditSudents = false;
    commentsVisible = true;
    module = eModule.advisory;
    advisoryState = '';
    filteredReviewers: any;
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Título del tesis',
        'Revisor',
        'Estado',
        ''
    ];
    formData = new FormData();
    advisorySelected: any;
    showEdit = false;
    titleModalDetailIserSelected: string = '';
    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    studentsList = [];
    alertForCancelation: Message[] | undefined;
    messageError: string = 'Lo sentimos, hubo un problema al intentar cargar la lista de asesorías. Por favor, inténtelo de nuevo más tarde. Si el inconveniente persiste, contacte al soporte técnico.';
    messageMoreInfo = [{ severity: 'info', detail: 'Es necesario completar todos los campos faltantes para continuar con la asesoría.' }];
    requiereMoreInfo: boolean = false;
    public tasksForm: FormGroup;
    public cancelattionForm: FormGroup;
    public advisoryForm: FormGroup;
    public studentForm: FormGroup;
    public editForm: FormGroup;
    public moreInfoForm: FormGroup;
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _advisory: FormControl = new FormControl([], [Validators.required]);
    private _students: FormControl = new FormControl([], [Validators.required]);
    private _advisoryReceptionDateToFacultyMI: FormControl = new FormControl('', [Validators.required]);
    private _advisoryApprovalDateUDIMI: FormControl = new FormControl('', [Validators.required]);
    private _paymentDateMI: FormControl = new FormControl('', [Validators.required]);
    private _submissionDateToSecretariatMI: FormControl = new FormControl('', [Validators.required]);
    private _reportNumberMI: FormControl = new FormControl('', [Validators.required]);
    private _resolutionDateMI: FormControl = new FormControl('', [Validators.required]);
    private _advisoryStartDate: FormControl = new FormControl('', [Validators.required]);
    private _advisoryEndDate: FormControl = new FormControl('', [Validators.required]);

    get cancelationComment() {
        return this._cancelationComment;
    }
    get dateCancelationReception() {
        return this._dateCancelationReception;
    }
    get taskDescription() {
        return this._taskDescription;
    }
    get reversedComments() {
        return this.comments.slice().reverse();
    }
    get advisory() {
        return this._advisory;
    }
    get students() {
        return this._students;
    }
    get advisoryReceptionDateToFacultyMI() {
        return this._advisoryReceptionDateToFacultyMI;
    }
    get advisoryApprovalDateUDIMI() {
        return this._advisoryApprovalDateUDIMI;
    }
    get paymentDateMI() {
        return this._paymentDateMI;
    }
    get submissionDateToSecretariatMI() {
        return this._submissionDateToSecretariatMI;
    }
    get reportNumberMI() {
        return this._reportNumberMI;
    }
    get resolutionDateMI() {
        return this._resolutionDateMI;
    }
    get advisoryStartDate() {
        return this._advisoryStartDate;
    }
    get advisoryEndDate() {
        return this._advisoryEndDate;
    }

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private elRef: ElementRef,
        private router: Router,
        private config: PrimeNGConfig,
        private loaderService: LoaderService,
        private dateFormatService: DateFormatService
    ) {
        this.moreInfoForm = this.fb.group({
            advisoryReceptionDateToFacultyMI: this.advisoryReceptionDateToFacultyMI,
            advisoryApprovalDateUDIMI: this.advisoryApprovalDateUDIMI,
            paymentDateMI: this.paymentDateMI,
            submissionDateToSecretariatMI: this.submissionDateToSecretariatMI,
            reportNumberMI: this.reportNumberMI,
            resolutionDateMI: this.resolutionDateMI,
            advisoryStartDate: this.advisoryStartDate,
            advisoryEndDate: this.advisoryEndDate,
        });
        this.editForm = this.fb.group({
            advisoryReceptionDateToFacultyMI: this.advisoryReceptionDateToFacultyMI,
            advisoryApprovalDateUDIMI: this.advisoryApprovalDateUDIMI,
            paymentDateMI: this.paymentDateMI,
            submissionDateToSecretariatMI: this.submissionDateToSecretariatMI,
            reportNumberMI: this.reportNumberMI,
            resolutionDateMI: this.resolutionDateMI,
            advisoryStartDate: this.advisoryStartDate,
            advisoryEndDate: this.advisoryEndDate,
        });
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
        this.cancelattionForm = this.fb.group({
            cancelationComment: this.cancelationComment,
        });
        this.advisoryForm = this.fb.group({
            advisory: this.advisory,
        });
        this.studentForm = this.fb.group({
            students: this.students,
        });
    }

    ngOnInit() {
        this.getAdvisoryList();
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

    getAdvisoryList() {
        this.getStatusList = 'charging';
        this.service.getAdvisoryList().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                this.registros = res.data;
                this.getStatusList = 'complete';
            }, (error) => {
                this.getStatusList = 'error';
            });
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

    viewDetailsInscription(data: any) {
        this.loaderService.show();
        if (data) {
            data.approval_date_udi === '00-00-0000'
                ? this.requiereMoreInfo = true
                : this.requiereMoreInfo = false;
            this.advisorySelected = data;

            console.log('this.advisorySelected', this.advisorySelected)
            this.advisoryState = this.advisorySelected.status;
            this.advisoryState === 'Aprobado' || this.advisoryState === 'Renuncia'
                ? this.commentsVisible = false
                : this.commentsVisible = true
            this.students.setValue(data.degree_processes.graduates);
            this.advisory.setValue(data.reviewer);
            this.fillDataInEditForm();
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    backList() {
        this.loaderService.show();
        this.getAdvisoryList();
        this.advisorySelected = null;
        this.students.setValue([]);
        this.advisory.setValue([]);
        this.moreInfoForm.reset();
        this.editForm.reset();
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    showEdition() {
        this.fillDataInEditForm();
        this.showEdit = true;
    }

    cancelEdition() {
        this.showEdit = false;
    }

    saveEdition() {
        this.loaderService.show();
        const rq = {
            user_id: this.advisory.value[0].id,
            reception_date_faculty: this.dateFormatService.transformDDMMYYYY(this.advisoryReceptionDateToFacultyMI.value),
            payment_date: this.dateFormatService.transformDDMMYYYY(this.paymentDateMI.value),
            approval_date_udi: this.dateFormatService.transformDDMMYYYY(this.advisoryApprovalDateUDIMI.value),
            shipment_date_secretary: this.dateFormatService.transformDDMMYYYY(this.submissionDateToSecretariatMI.value),
            report: this.reportNumberMI.value,
            resolution_date: this.dateFormatService.transformDDMMYYYY(this.resolutionDateMI.value),
            start_date_advisory: this.dateFormatService.transformDDMMYYYY(this.advisoryStartDate.value),
            end_date_advisory: this.dateFormatService.transformDDMMYYYY(this.advisoryEndDate.value),
        }
        this.service.putAdvisoryUpdate(this.advisorySelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.advisorySelectedUpdate();
                    this.showEdit = false;
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

    goToReview() {
        this.loaderService.show();
        const rq = {
            status: 'En Revisión'
        }
        this.service.putAdvisoryStatusUpdate(this.advisorySelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'La asesoría pasó a Revisión.',
                        life: 3000,
                    });
                    this.advisoryState = 'En Revisión';
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

    goToObserved() {
        this.loaderService.show();
        const rq = {
            status: 'Observado'
        }
        this.service.putAdvisoryStatusUpdate(this.advisorySelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'La asesoría pasó a Revisión.',
                        life: 3000,
                    });
                    this.advisoryState = 'Observado';
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
            status: 'Renuncia',
            description: this.cancelationComment.value,
        }
        this.service.putAdvisoryStatusUpdate(this.advisorySelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.cancelEdition();
                    this.advisoryState = 'Renuncia';
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Conformación',
                        detail: 'Se ha realizado la cencelación de la asesoría.',
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
    }

    hideCancelDialog() {
        this.showDialogCancel = false;
    }

    goToApprove() {
        this.confirmationService.confirm({
            header: 'Confirmación',
            message:
                'Estás a punto de aprobar esta inscripción, ¿estás seguro(a)?.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.loaderService.show();
                const rq = {
                    status: 'Aprobado',
                }
                this.service.putAdvisoryStatusUpdate(this.advisorySelected.id, rq).pipe(
                    finalize(() => {
                        this.loaderService.hide();
                    }), takeUntil(this.destroy$)
                ).subscribe(
                    (res: any) => {
                        if (res.status) {
                            this.cancelEdition();
                            this.advisoryState = 'Aprobado';
                            this.messageService.add({
                                key: 'tst',
                                severity: 'info',
                                summary: 'Conformación',
                                detail: 'Se ha realizado la aprobación de la asesoría.',
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

    addNotificationForChangeState(comment: string) {
        this.comments.push({
            name: 'Cesar Jauregui',
            content: comment,
            isComment: false,
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
        this.advisory.setValue(userSelected);
    }

    getStudentSelected(userSelected: any) {
        this.students.setValue(userSelected);
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.getAdvisoryList();
        }
    }

    saveMoreInfo() {
        this.loaderService.show();
        const rq = {
            user_id: this.advisory.value[0].id,
            reception_date_faculty: this.dateFormatService.transformDDMMYYYY(this.advisoryReceptionDateToFacultyMI.value),
            payment_date: this.dateFormatService.transformDDMMYYYY(this.paymentDateMI.value),
            approval_date_udi: this.dateFormatService.transformDDMMYYYY(this.advisoryApprovalDateUDIMI.value),
            shipment_date_secretary: this.dateFormatService.transformDDMMYYYY(this.submissionDateToSecretariatMI.value),
            report: this.reportNumberMI.value,
            resolution_date: this.dateFormatService.transformDDMMYYYY(this.resolutionDateMI.value),
            start_date_advisory: this.dateFormatService.transformDDMMYYYY(this.advisoryStartDate.value),
            end_date_advisory: this.dateFormatService.transformDDMMYYYY(this.advisoryEndDate.value),
        }
        this.service.putAdvisoryUpdate(this.advisorySelected.id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.advisorySelectedUpdate();
                    this.requiereMoreInfo = false;
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmado',
                        detail: 'Lo datos han sido guardados.',
                        life: 3000,
                    });
                    this.moreInfoForm.reset();
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

    fillDataInEditForm(): void {
        this.advisoryReceptionDateToFacultyMI.setValue(this.advisorySelected.reception_date_faculty);
        this.advisoryApprovalDateUDIMI.setValue(this.advisorySelected.approval_date_udi);
        this.paymentDateMI.setValue(this.advisorySelected.payment_date);
        this.submissionDateToSecretariatMI.setValue(this.advisorySelected.shipment_date_secretary);
        this.reportNumberMI.setValue(this.advisorySelected.report);
        this.resolutionDateMI.setValue(this.advisorySelected.resolution_date);
        this.advisoryStartDate.setValue(this.advisorySelected.start_date_advisory);
        this.advisoryEndDate.setValue(this.advisorySelected.end_date_advisory);
    }

    advisorySelectedUpdate(): void {
        this.advisorySelected.reviewer = this.dateFormatService.transformDDMMYYYY(this.advisory.value);
        this.advisorySelected.approval_date_udi = this.dateFormatService.transformDDMMYYYY(this.advisoryApprovalDateUDIMI.value);
        this.advisorySelected.reception_date_faculty = this.dateFormatService.transformDDMMYYYY(this.advisoryReceptionDateToFacultyMI.value);
        this.advisorySelected.payment_date = this.dateFormatService.transformDDMMYYYY(this.paymentDateMI.value);
        this.advisorySelected.shipment_date_secretary = this.dateFormatService.transformDDMMYYYY(this.submissionDateToSecretariatMI.value);
        this.advisorySelected.report = this.reportNumberMI.value;
        this.advisorySelected.resolution_date = this.dateFormatService.transformDDMMYYYY(this.resolutionDateMI.value);
        this.advisorySelected.start_date_advisory = this.dateFormatService.transformDDMMYYYY(this.advisoryStartDate.value);
        this.advisorySelected.end_date_advisory = this.dateFormatService.transformDDMMYYYY(this.advisoryEndDate.value);
        this.advisorySelected.degree_processes.graduates = this.dateFormatService.transformDDMMYYYY(this.students.value);
    }

    onFileChange(files: any) {
        this.formData = files;
    }

    clearFile() {
        this.formData = new FormData();
    }

    hideAddFilesDialog() {
        this.clearFile();
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
        this.service.postRegisterAdvisoryFile(this.formData, this.advisorySelected.id).pipe(
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
