import { Component, ElementRef, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
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
import { IStudent, ITeacher } from '../../cross-interfaces/comments-interfaces';
import { LoaderService } from 'src/app/layout/service/loader.service';

@Component({
    templateUrl: './inscription-tracking.component.html',
    styleUrls: ['./inscription-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class InscriptionTrackingComponent implements OnInit {
    products: Product[] = [];

    rowsPerPageOptions = [5, 10, 20];

    registros = [
        {
            "id": 1,
            "file": 111,
            "professional_school": "ISI",
            "thesis_project_title": "a",
            "office_number": "11",
            "resolution_number": "11",
            "general_status": "Inscripción",
            "inscriptions": [
                {
                    "id": 1,
                    "degree_processes_id": 1,
                    "reception_date_faculty": "2024-08-07",
                    "approval_date_udi": "2024-08-07",
                    "status": "Inscrito",
                    "teachers": [
                        {
                            "id": 5,
                            "name": "Cesar",
                            "surnames": "Jauregui Saavedra",
                            "code": 11525320,
                            "email": "cesarjauregui@test.com",
                            "phone": 986457511,
                            "orcid": null,
                            "cip": null
                        }
                    ]
                }
            ],
            "graduates": [
                {
                    "id": 4,
                    "name": "Mario",
                    "surnames": "Ayala Sanchez",
                    "email": "mario@testt.com",
                    "phone": '987145312',
                    "code": '15467824'
                },
            ]
        },
        {
            "id": 2,
            "file": 222,
            "professional_school": "ISI",
            "thesis_project_title": "La inteligencia artificial",
            "office_number": "11",
            "resolution_number": "11",
            "general_status": "Inscripción",
            "inscriptions": [
                {
                    "id": 1,
                    "degree_processes_id": 1,
                    "reception_date_faculty": "2024-08-07",
                    "approval_date_udi": "2024-08-07",
                    "status": "Inscrito",
                    "teachers": [
                        {
                            "id": 9,
                            "name": "Daniela Agustina Leal Nieves Hijo",
                            "surnames": "Carbajal",
                            "code": 37726580,
                            "email": "wrobles@example.com",
                            "phone": 951812965,
                            "orcid": "voluptatem",
                            "cip": 68751388
                        }
                    ]
                }
            ],
            "graduates": [
                {
                    "id": 4,
                    "name": "Mario",
                    "surnames": "Ayala Sanchez",
                    "email": "mario@testt.com",
                    "phone": '987145312',
                    "code": '15467824'
                },
                {
                    "id": 5,
                    "name": "Daniel",
                    "surnames": "Minaya Alvarez",
                    "email": "daniel@testt.com",
                    "phone": '987145312',
                    "code": '15467824'
                }
            ]
        }
    ];

    usuarios: IStudent[] = [
        {
            "id": 4,
            "name": "Mario",
            "surnames": "Ayala Sanchez",
            "email": "mario@testt.com",
            "phone": '987145312',
            "code": '15467824'
        },
        {
            "id": 5,
            "name": "Daniel",
            "surnames": "Minaya Alvarez",
            "email": "daniel@testt.com",
            "phone": '987145312',
            "code": '15467824'
        },
        {
            "id": 6,
            "name": "Lucía",
            "surnames": "Martinez Herrera",
            "email": "lucia@testt.com",
            "phone": '981245312',
            "code": '12547896'
        },
        {
            "id": 7,
            "name": "Javier",
            "surnames": "Lopez Diaz",
            "email": "javier@testt.com",
            "phone": '987654321',
            "code": '11457832'
        },
        {
            "id": 8,
            "name": "Ana",
            "surnames": "Perez Morales",
            "email": "ana@testt.com",
            "phone": '986532147',
            "code": '11326745'
        },
        {
            "id": 9,
            "name": "Carlos",
            "surnames": "Ramirez Soto",
            "email": "carlos@testt.com",
            "phone": '985641237',
            "code": '15478965'
        },
        {
            "id": 10,
            "name": "Valeria",
            "surnames": "Rojas Gutierrez",
            "email": "valeria@testt.com",
            "phone": '984512376',
            "code": '12547896'
        }
    ];

    teachers: ITeacher[] = [
        {
            "id": 3,
            "name": "Nadia Daniela Vallejo Rodríguez",
            "surnames": "Gil",
            "code": 45778452,
            "email": "joshua65@example.net",
            "phone": 297546617,
            "orcid": "esse",
            "cip": 38344486
        },
        {
            "id": 7,
            "name": "Ashley Esquibel Hijo",
            "surnames": "Brito",
            "code": 56427284,
            "email": "kochoa@example.org",
            "phone": 177932979,
            "orcid": "possimus",
            "cip": 47213143
        },
        {
            "id": 9,
            "name": "Daniela Agustina Leal Nieves Hijo",
            "surnames": "Carbajal",
            "code": 37726580,
            "email": "wrobles@example.com",
            "phone": 951812965,
            "orcid": "voluptatem",
            "cip": 68751388
        }
    ]

    filteredItems: any[] | undefined;

    graduatesList: [] = [];
    reviewerList: [] = [];

    showDialogCancel = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
    showEditSudents = false;
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
    reviewersList = [];
    filteredReviewers: any;
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    inscriptionSelected: any;
    showEdit = false;
    titleModalDetailIserSelected: string = '';
    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    studentsList = [];
    alertForCancelation: Message[] | undefined;
    items: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' }, 
        { label: 'Proyecto de tesis', visible: true},
    ];
    itemsDetails: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' }, 
        { label: 'Proyecto de tesis',},
        { label: 'Detalle de proyecto de tesis', visible: true},
    ];
    commentsForm: FormGroup;
    tasksForm: FormGroup;
    cancelattionForm: FormGroup;
    studentsForm: FormGroup;
    teacherForm: FormGroup;
    private _comment: FormControl = new FormControl('', [Validators.required]);
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
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

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private elRef: ElementRef,
        private router: Router,
        private config: PrimeNGConfig,
        private loaderService: LoaderService,
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
    }

    ngOnInit() {
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
            this.inscriptionState = data.inscriptions[0].status;
            this.countTask();
        }
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    backList() {
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
            case 'cancelado':
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
        this.inscriptionState = 'En revisión';
    }

    goToObserved() {
        // this.addNotificationForChangeState(
        //     'La inscripción del proyecto de Tesis pasó a Observado por Cesar Jauregui Saavedra'
        // );
        this.inscriptionState = 'Observado';
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
        this.inscriptionState = 'Cancelado';
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
                this.inscriptionState = 'Aprobado';
                // this.addNotificationForChangeState(
                //     'La inscripción del proyecto de Tesis pasó a Aprobado por Cesar Jauregui Saavedra'
                // );
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

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredItems = this.usuarios
            .filter(
                (usuario) =>
                    usuario.name.toLowerCase().includes(query) ||
                    usuario.surnames.toLowerCase().includes(query)
            )
            .map((usuario) => ({
                ...usuario,
                fullName: `${usuario.name} ${usuario.surnames}`,
            }));
    }

    searchTeachers(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredItems = this.teachers
            .filter(
                (usuario) =>
                    usuario.name.toLowerCase().includes(query) ||
                    usuario.surnames.toLowerCase().includes(query)
            )
            .map((usuario) => ({
                ...usuario,
                fullName: `${usuario.name} ${usuario.surnames}`,
            }));
    }

    watchStudents() {
        this.students.valueChanges.pipe().subscribe((res: IStudent[]) => {
            console.log(res);
            if (res.length > 2) {
                const students = [...res];
                students.splice(2, 1);
                this.students.setValue(students);
            }
        })
    }

    watchTeacher() {
        this.teacher.valueChanges.pipe().subscribe((res: ITeacher[]) => {
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
}
