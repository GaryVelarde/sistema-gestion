import { Component, ElementRef, OnInit } from '@angular/core';
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
import { finalize } from 'rxjs';
import { DateFormatService } from 'src/app/services/date-format.service';
import { eModule } from 'src/app/commons/enums/app,enum';

@Component({
    templateUrl: './advisory-tracking.component.html',
    styleUrls: ['./advisory-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class AdvisoryTrackingComponent implements OnInit {
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

    egressList = [];
    showDialogCancel = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
    showEditSudents = false;
    module = eModule.advisory;
    advisoryState = '';
    totalTask = 0;
    totalTaskIncomplete = 0;
    totalTaskComplete = 0;

    tasks = [
        {
            id: '1',
            description: 'Description 1',
            checked: false,
        },
        {
            id: '2',
            description: 'Description 2',
            checked: false,
        },
    ];
    reviewersList = [];
    graduatesList = []
    filteredReviewers: any;
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Título del tesis',
        'Revisor',
        'Estado',
        ''
    ];
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
    public dataForm: FormGroup;
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
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
        this.cancelattionForm = this.fb.group({
            cancelationComment: this.cancelationComment,
            dateCancelationReception: this.dateCancelationReception
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

    getAdvisoryList() {
        this.getStatusList = 'charging';
        this.service.getAdvisoryList().pipe().subscribe(
            (res: any) => {
                this.registros = res.data;
                this.getStatusList = 'complete';
                console.log(res.data)
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
            this.reviewersList = data.reviewer;
            this.graduatesList = data.degree_processes.graduates;
            this.advisoryState = this.advisorySelected.status;
            this.countTask();
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    backList() {
        this.loaderService.show();
        this.advisorySelected = null;
        this.reviewersList = [];
        this.graduatesList = [];
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    showEdition() {
        this.showEdit = true;
    }

    cancelEdition() {
        this.showEdit = false;
    }

    saveEdition() { }

    goToReview() {
        this.addNotificationForChangeState(
            'La inscripción del proyecto de Tesis pasó a Revisión por Cesar Jauregui Saavedra'
        );
        this.advisoryState = 'En revisión';
    }

    goToObserved() {
        this.addNotificationForChangeState(
            'La inscripción del proyecto de Tesis pasó a Observado por Cesar Jauregui Saavedra'
        );
        this.advisoryState = 'Observado';
    }

    goToCancelation() {
        this.showDialogCancel = true;
        this.alertForCancelation = [
            { severity: 'warn', detail: 'Recuerda que una vez cancelada la inscripción no se podrá reabrir.' },
        ];
    }

    confirmCancelation() {
        this.cancelEdition();
        this.showDialogCancel = false;
        this.advisoryState = 'Cancelado';
        this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmado',
            detail: 'Se ha realizado la cencelación de la inscripción.',
            life: 3000,
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
                this.advisoryState = 'Aprobado';
                this.addNotificationForChangeState(
                    'La inscripción del proyecto de Tesis pasó a Aprobado por Cesar Jauregui Saavedra'
                );
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Se ha realizado la aprobación de la inscripción.',
                    life: 3000,
                });
            },
            reject: () => { },
        });
    }

    taskDone(inputId: string, checkbox: any): void {
        const labelElement = this.elRef.nativeElement.querySelector(
            `label[for="${inputId}"]`
        );
        if (labelElement) {
            labelElement.classList.add('task-done');
        }
        if (checkbox) {
            checkbox.disabled = true;
        }

        this.countTask();
    }

    isTaskDone(task: any): any {
        return {
            'task-done': task.checked,
        };
    }

    removeTask(taskId: string) {
        const index = this.tasks.findIndex((task) => task.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
        this.countTask();
    }

    countTask(): void {
        this.totalTask = 0;
        this.totalTaskIncomplete = 0;
        this.totalTaskComplete = 0;
        this.tasks.forEach((task) => {
            if (task.checked) {
                this.totalTaskComplete++;
            } else {
                this.totalTaskIncomplete++;
            }
            this.totalTask++;
            // Aquí puedes realizar la acción que necesites para cada tarea
        });
    }

    addNotificationForChangeState(comment: string) {
        this.comments.push({
            name: 'Cesar Jauregui',
            content: comment,
            isComment: false,
        });
    }

    addTask(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (this.taskDescription.value) {
                this.tasks.push({
                    id: '11',
                    description: this.taskDescription.value,
                    checked: false,
                });
                this.taskDescription.reset();
            }
        }
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

    callGetTeachersList() {
        this.service.getTeachersList().subscribe((res) => {
            this.reviewersList = res.teachers;
            console.log(res);
        });
    }

    filterReviewers(event: any) {
        const query = event.query.toLowerCase();
        this.filteredReviewers = this.reviewersList.filter(
            (student) =>
                student.name.toLowerCase().includes(query) ||
                student.surnames.toLowerCase().includes(query)
        );
    }


    filterStudents(event: { query: string }) {
        const query = event.query.toLowerCase();
        this.filteredStudents = this.studentsList.filter(
            (student) =>
                student.name.toLowerCase().includes(query) ||
                student.surnames.toLowerCase().includes(query)
        );
        console.log('filteredCountries', this.filteredStudents);
    }

    filterSecondStudents(event: { query: string }) {
        const query = event.query.toLowerCase();
        this.filteredSecondStudents = this.studentsList.filter(
            (student) =>
                student.name.toLowerCase().includes(query) ||
                student.surnames.toLowerCase().includes(query)
        );
        console.log('filteredCountries', this.filteredSecondStudents);
    }

    callGetStudentList() {
        this.getStudentListProcess = 'charging';
        this.service.getStudentsList().subscribe((res) => {
            this.getStudentListProcess = 'complete';
            this.studentsList = res.graduates_students;
        }, (error) => {
            this.getStudentListProcess = 'error';
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

    getUserSelected(userSelected: any) {
        console.log('userSelected', userSelected)
        this.advisory.setValue(userSelected);
    }

    getStudentSelected(userSelected: any) {
        console.log('students', userSelected)
        this.students.setValue(userSelected);
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.getAdvisoryList();
        }
    }

    saveMoreInfo() {
        this.loaderService.show();
        //this.requiereMoreInfo = false;
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
                if(res.status) {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmado',
                        detail: 'Lo datos han sido guardados.',
                        life: 3000,
                    });
                }
                console.log(res);
            }, (error) => {
                console.log(error);
            })
    }
}
