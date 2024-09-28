import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IStudent, ITeacher } from '../../cross-interfaces/comments-interfaces';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { DateFormatService } from 'src/app/services/date-format.service';

@Component({
    templateUrl: './inscription-tracking.component.html',
    styleUrls: ['./inscription-tracking.component.scss'],
    providers: [MessageService],
})
export class InscriptionTrackingComponent implements OnInit, OnDestroy {
    products: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    registros = [];
    teacherL = userType.teacher;
    studentL = userType.student;

    module = eModule.inscription;
    getInscriptionListProcess: string;
    filteredItems: any[] | undefined;
    private destroy$ = new Subject<void>();
    graduatesList: [] = [];
    reviewerList: [] = [];
    commentsVisible = true;
    showDialogCancel = false;
    showDialogAprobation = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
    showEditSudents = false;
    showDialogAddFiles = false;
    inscriptionState = '';
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
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Título de tesis',
        'Revisor',
        'Estado',
        ''
    ];
    reviewersList = [];
    filteredReviewers: any;
    inscriptionSelected: any;
    showEdit = false;
    titleModalDetailIserSelected: string = '';
    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    studentsList = [];
    alertForCancelation: Message[] = [
        { severity: 'warn', detail: 'Recuerda que una vez cancelada la inscripción no se podrá reabrir.' },
    ];
    alertForAprobation: Message[] = [
        { severity: 'info', detail: 'Luego de aprobar el proyecto de tesis pasará automáticamente a la sección de Asesorías.' },
    ];
    items: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Proyecto de tesis', visible: true },
    ];
    itemsDetails: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Proyecto de tesis', },
        { label: 'Detalle de proyecto de tesis', visible: true },
    ];
    formData = new FormData();
    reloadFiles = false;
    messageError: string = 'Se produjo un error al cargar la lista de proyectos de tesis. Por favor, inténtelo de nuevo más tarde';
    commentsForm: FormGroup;
    tasksForm: FormGroup;
    cancelattionForm: FormGroup;
    aprobationForm: FormGroup;
    studentsForm: FormGroup;
    teacherForm: FormGroup;
    private _comment: FormControl = new FormControl('', [Validators.required]);
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
    private _sentToSecretaryDate: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _students: FormControl = new FormControl([] as IStudent[], [Validators.required]);
    private _teacher: FormControl = new FormControl([] as ITeacher[], [Validators.required]);

    get comment() {
        return this._comment;
    }
    get cancelationComment() {
        return this._cancelationComment;
    }
    get dateCancelationReception() {
        return this._dateCancelationReception;
    }
    get taskDescription() {
        return this._taskDescription;
    }

    get students() {
        return this._students;
    }
    get teacher() {
        return this._teacher;
    }
    get sentToSecretaryDate() {
        return this._sentToSecretaryDate;
    }

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private service: AuthService,
        private elRef: ElementRef,
        private router: Router,
        private config: PrimeNGConfig,
        private loaderService: LoaderService,
        private dateFormat: DateFormatService,
    ) {
        this.commentsForm = this.fb.group({
            comment: this.comment,
        });
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
        this.cancelattionForm = this.fb.group({
            cancelationComment: this.cancelationComment,
            dateCancelationReception: this.dateCancelationReception
        });
        this.studentsForm = this.fb.group({
            students: this.students,
        });
        this.teacherForm = this.fb.group({
            teacher: this.teacher,
        });
        this.aprobationForm = this.fb.group({
            sentToSecretaryDate: this.sentToSecretaryDate,
        });
    }

    ngOnInit() {
        this.callGetInscriptions();
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
        this.watchStudents();
        this.watchTeacher();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    callGetInscriptions() {
        this.getInscriptionListProcess = 'charging';
        this.registros = [];
        this.service.getInscription().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                if (res.data) {
                    this.registros = res.data;
                    this.getInscriptionListProcess = 'complete';
                }
            }, (error) => {
                this.getInscriptionListProcess = 'error';
                console.log(error)
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

    viewDetailsInscription(data: any) {
        this.loaderService.show();
        if (data) {
            this.inscriptionSelected = data;
            this.graduatesList = data.graduates;
            this.reviewerList = data.inscriptions[0].teachers;
            this.teacher.setValue(data.inscriptions[0].teachers);
            this.students.setValue(data.graduates);
            this.inscriptionState = data.inscriptions[0].status;
            this.inscriptionState === 'Aprobado' || this.inscriptionState === 'Renuncia'
                ? this.commentsVisible = false
                : this.commentsVisible = true
            this.countTask();
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    backList() {
        this.callGetInscriptions();
        this.loaderService.show();
        this.inscriptionSelected = null;
        this.graduatesList = [];
        this.reviewerList = [];
        this.inscriptionState = null;
        this.showEdit = false;
        this.studentsForm.reset();
        this.teacherForm.reset();
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    get severity(): string {
        let severity = '';
        switch (this.inscriptionSelected.inscripciones[0].estado) {
            case 'inscrito':
                severity = 'success';
                break;
            case 'observado':
                severity = 'warning';
                break;
            case 'Renuncia':
                severity = 'danger';
                break;
        }
        return severity;
    }

    showEdition() {
        this.showEdit = true;
        console.log('this.graduatesList', this.graduatesList);
        const arrStudents = this.addFullNameProperty(this.graduatesList);
        const arrTeacher = this.addFullNameProperty(this.reviewerList);
        this.students.setValue(arrStudents);
        this.teacher.setValue(arrTeacher);
    }

    test() {
        this.students.setValue([{
            "id": 5,
            "name": "Cesar",
            "surnames": "Jauregui",
            "email": "cesar@testt.com",
            "phone": '987145312',
            "code": '15467824'
        }]);
    }

    cancelEdition() {
        this.studentsForm.reset();
        this.teacherForm.reset();
        this.showEdit = false;
    }

    saveEdition() {
        this.graduatesList = this.students.value;
        this.reviewerList = this.teacher.value;
        this.showEdit = false;
    }

    goToReview() {
        // this.addNotificationForChangeState(
        //     'La inscripción del proyecto de Tesis pasó a Revisión por Cesar Jauregui Saavedra'
        // );
        this.loaderService.show();
        const rq = {
            status: 'En Revisión'
        }
        this.service.putInscriptionStatusUpdate(this.inscriptionSelected.inscriptions[0].id, rq).pipe(
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
                        detail: 'La inscripción pasó a Revisión.',
                        life: 3000,
                    });
                    this.inscriptionState = 'En Revisión';
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al actualizar el estado.',
                    life: 3000,
                });
                console.log(error)
            });
    }

    goToObserved() {
        // this.addNotificationForChangeState(
        //     'La inscripción del proyecto de Tesis pasó a Observado por Cesar Jauregui Saavedra'
        // );
        this.loaderService.show();
        const rq = {
            status: 'Observado'
        }
        this.service.putInscriptionStatusUpdate(this.inscriptionSelected.inscriptions[0].id, rq).pipe(
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
                        detail: 'La inscripción pasó a Observado.',
                        life: 3000,
                    });
                    this.inscriptionState = 'Observado';
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al actualizar el estado.',
                    life: 3000,
                });
                console.log(error)
            });
    }

    goToCancelation() {
        this.alertForCancelation = [
            { severity: 'warn', detail: 'Recuerda que una vez cancelada la inscripción no se podrá reabrir.' },
        ];
        this.showDialogCancel = true;
    }

    confirmCancelation() {
        this.showDialogCancel = false;
        this.loaderService.show();
        console.log('dateCancelationReception', this.dateCancelationReception.value)
        const rq = {
            status: 'Renuncia',
            description: this.cancelationComment.value,
            shipment_date_secretary: "05-05-2024",
        }
        this.service.putInscriptionStatusUpdate(this.inscriptionSelected.inscriptions[0].id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.cancelEdition();
                    this.inscriptionState = 'Renuncia';
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Conformación',
                        detail: 'Se ha realizado la cencelación de la inscripción.',
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
                console.log(error)
            });
    }

    hideCancelDialog() {
        this.showDialogCancel = false;
    }

    goToApprove() {
        this.alertForAprobation = [
            { severity: 'info', detail: 'Luego de aprobar el proyecto de tesis pasará automáticamente a la sección de Asesorías.' },
        ];
        this.showDialogAprobation = true;
    }

    taskDone(inputId: string): void {
        const labelElement = this.elRef.nativeElement.querySelector(
            `label[for="${inputId}"]`
        );
        if (labelElement) {
            labelElement.classList.add('task-done');
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
        this.service.getTeachersList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
        this.service.getStudentsList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
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

    watchStudents() {
        this.students.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res: IStudent[]) => {
            console.log(res);
            if (res.length > 2) {
                const students = [...res];
                students.splice(2, 1);
                this.students.setValue(students);
            }
        })
    }

    watchTeacher() {
        this.teacher.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res: ITeacher[]) => {
            if (res.length > 1) {
                const teacher = [...res];
                teacher.splice(1, 1);
                this.teacher.setValue(teacher);
            }
        })
    }

    addFullNameProperty(data: any[]): any[] {
        return data.map(item => ({
            ...item,
            fullName: `${item.name} ${item.surnames}`
        }));
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.callGetInscriptions();
        }
    }

    getTeacherSelected(userSelected: any) {
        console.log('teacher', userSelected)
        this.teacher.setValue(userSelected);
    }

    getStudentSelected(userSelected: any) {
        console.log('students', userSelected)
        this.students.setValue(userSelected);
    }

    hideAprobationDialog() {
        this.showDialogAprobation = false;
    }

    confirmAprobation() {
        this.loaderService.show();
        this.showDialogAprobation = false;
        const rq = {
            status: 'Aprobado',
            shipment_date_secretary: this.dateFormat.transformDDMMYYYY(this.sentToSecretaryDate.value)
        }
        this.service.putInscriptionStatusUpdate(this.inscriptionSelected.inscriptions[0].id, rq).pipe(
            finalize(() => {
                this.loaderService.hide();
            }), takeUntil(this.destroy$)
        ).subscribe(
            (res: any) => {
                console.log(res)
                if (res.status) {
                    this.commentsVisible = false
                    this.inscriptionState = 'Aprobado';
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'Se ha realizado la aprobación de la inscripción.',
                        life: 3000,
                    });
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al actualizar el estado.',
                    life: 3000,
                });
                console.log(error)
            })
        // this.addNotificationForChangeState(
        //     'La inscripción del proyecto de Tesis pasó a Aprobado por Cesar Jauregui Saavedra'
        // );
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

    saveFiles() {
        this.loaderService.show();
        this.showDialogAddFiles = false;
        this.service.postRegisterIncriptionFile(this.formData, this.inscriptionSelected.inscriptions[0].id).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.reloadFiles = true;
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
        // Realiza el casting a `any` para evitar el error de TypeScript
        return !(formData as any).entries().next().done;
    }
}
