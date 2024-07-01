import { Component, ElementRef, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { InscriptionPresenter } from '../inscription/insctiption-presenter';

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
            id: 12,
            expediente: 1226,
            escuela_profesional: 'IET',
            titulo_proyecto_tesis:
                'Desarrollo de una aplicación móvil para la gestión de tareas escolares',
            numero_oficio: '124-114',
            numero_resolucion: '113-114',
            estado_general: 'Inscripción',
            inscripciones: [
                {
                    id: 12,
                    proceso_titulacion_id: 12,
                    fecha_recepcion_facultad: '2205-01-15',
                    fecha_aprobacion_UDI: '2024-06-08',
                    estado: 'Inscrito',
                    docente: [
                        {
                            id: 2,
                            nombre: 'César',
                            apellidos: 'Jauregui',
                        },
                    ],
                    observaciones: [
                        {
                            id: 12,
                            inscripcion_id: 12,
                            descripcion: 'Observación',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                    archivos: [
                        {
                            id: 7,
                            inscripcion_id: 12,
                            archivo:
                                'https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                },
            ],
            egresados: [
                {
                    id: 3,
                    nombre: 'María',
                    apellidos: 'Velarde',
                    email: 'maria@test.com',
                    celular: 123456789,
                },
                {
                    id: 4,
                    nombre: 'Pedro',
                    apellidos: 'González',
                    email: 'pedro@test.com',
                    celular: 123456789,
                },
            ],
        },
        {
            id: 13,
            expediente: 1227,
            escuela_profesional: 'IET',
            titulo_proyecto_tesis:
                'Análisis de la eficiencia energética en edificios inteligentes',
            numero_oficio: '125-115',
            numero_resolucion: '114-115',
            estado_general: 'Inscripción',
            inscripciones: [
                {
                    id: 13,
                    proceso_titulacion_id: 13,
                    fecha_recepcion_facultad: '2205-01-15',
                    fecha_aprobacion_UDI: '2024-06-08',
                    estado: 'Inscrito',
                    docente: [
                        {
                            id: 3,
                            nombre: 'Luis',
                            apellidos: 'Pérez',
                        },
                    ],
                    observaciones: [
                        {
                            id: 13,
                            inscripcion_id: 13,
                            descripcion: 'Observación',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                    archivos: [
                        {
                            id: 8,
                            inscripcion_id: 13,
                            archivo:
                                'https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                },
            ],
            egresados: [
                {
                    id: 5,
                    nombre: 'Ana',
                    apellidos: 'López',
                    email: 'ana@test.com',
                    celular: 123456789,
                },
                {
                    id: 6,
                    nombre: 'Roberto',
                    apellidos: 'García',
                    email: 'roberto@test.com',
                    celular: 123456789,
                },
            ],
        },
        {
            id: 14,
            expediente: 1228,
            escuela_profesional: 'IET',
            titulo_proyecto_tesis:
                'Desarrollo de un sistema de gestión de inventario para una cadena de supermercados',
            numero_oficio: '126-116',
            numero_resolucion: '115-116',
            estado_general: 'Inscripción',
            inscripciones: [
                {
                    id: 14,
                    proceso_titulacion_id: 14,
                    fecha_recepcion_facultad: '2205-01-15',
                    fecha_aprobacion_UDI: '2024-06-08',
                    estado: 'Inscrito',
                    docente: [
                        {
                            id: 4,
                            nombre: 'Carlos',
                            apellidos: 'Martínez',
                        },
                    ],
                    observaciones: [
                        {
                            id: 14,
                            inscripcion_id: 14,
                            descripcion: 'Observación',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                    archivos: [
                        {
                            id: 9,
                            inscripcion_id: 14,
                            archivo:
                                'https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                },
            ],
            egresados: [
                {
                    id: 7,
                    nombre: 'Sandra',
                    apellidos: 'Ramírez',
                    email: 'sandra@test.com',
                    celular: 123456789,
                },
                {
                    id: 8,
                    nombre: 'Pedro',
                    apellidos: 'Pérez',
                    email: 'pedro@test.com',
                    celular: 123456789,
                },
            ],
        },
        {
            id: 15,
            expediente: 1229,
            escuela_profesional: 'IET',
            titulo_proyecto_tesis:
                'Implementación de un sistema de gestión de recursos humanos para empresas',
            numero_oficio: '127-117',
            numero_resolucion: '116-117',
            estado_general: 'Inscripción',
            inscripciones: [
                {
                    id: 15,
                    proceso_titulacion_id: 15,
                    fecha_recepcion_facultad: '2205-01-15',
                    fecha_aprobacion_UDI: '2024-06-08',
                    estado: 'Inscrito',
                    docente: [
                        {
                            id: 5,
                            nombre: 'Elena',
                            apellidos: 'Gómez',
                        },
                    ],
                    observaciones: [
                        {
                            id: 15,
                            inscripcion_id: 15,
                            descripcion: 'Observación',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                    archivos: [
                        {
                            id: 10,
                            inscripcion_id: 15,
                            archivo:
                                'https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png',
                            created_at: '2024-06-20T05:28:52.000000Z',
                        },
                    ],
                },
            ],
            egresados: [
                {
                    id: 9,
                    nombre: 'Miguel',
                    apellidos: 'Fernández',
                    email: 'miguel@test.com',
                    celular: 123456789,
                },
            ],
        },
    ];

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
        // Agrega más elementos según sea necesario
    ];

    egressList = [];
    showDialogCancel = false;
    showSelectNewReviwer = false;
    showSelectNewStudent = false;
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
    public commentsForm: FormGroup;
    public tasksForm: FormGroup;
    public cancelattionForm: FormGroup;
    private _comment: FormControl = new FormControl('', [Validators.required]);
    private _cancelationComment: FormControl = new FormControl('', [Validators.required]);
    private _dateCancelationReception: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);

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

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private elRef: ElementRef,
        private router: Router,
        private config: PrimeNGConfig,
        private presenter: InscriptionPresenter,
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
        if (data) {
            this.inscriptionSelected = data;
            this.egressList = data.egresados;
            console.log('egressList', this.egressList);
            this.inscriptionState = data.inscripciones[0].estado;
            this.countTask();
        }
    }

    backList() {
        this.inscriptionSelected = null;
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
        this.callGetStudentList();
        this.callGetTeachersList();
        this.showEdit = true;
    }

    cancelEdition() {
        this.showEdit = false;
    }

    saveEdition() {}

    goToReview() {
        this.addNotificationForChangeState(
            'La inscripción del protecto de Tesis pasó a Revisión por Cesar Jauregui Saavedra'
        );
        this.inscriptionState = 'En revisión';
    }

    goToObserved() {
        this.addNotificationForChangeState(
            'La inscripción del protecto de Tesis pasó a Observado por Cesar Jauregui Saavedra'
        );
        this.inscriptionState = 'Observado';
    }

    goToCancelation() {
        this.showDialogCancel = true;
        
    }

    confirmCancelation() {
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
                this.addNotificationForChangeState(
                    'La inscripción del protecto de Tesis pasó a Aprobado por Cesar Jauregui Saavedra'
                );
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Se ha realizado la aprobación de la inscripción.',
                    life: 3000,
                });
            },
            reject: () => {},
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
            // Aquí puedes realizar la acción que necesites para cada tarea
        });
    }

    addComment(): void {
        if (this.comment.value) {
            this.comments.push({
                name: 'Gary Velarde',
                content: this.comment.value,
                isComment: true,
            });
            this.comment.reset();
            this.scrollDown();
        }
    }

    addNotificationForChangeState(comment: string) {
        this.comments.push({
            name: 'Cesar Jauregui',
            content: comment,
            isComment: false,
        });
    }

    addTask(): void {
        if (this.taskDescription.value) {
            this.tasks.push({
                id: '11',
                description: this.taskDescription.value,
                checked: false,
            });
            this.taskDescription.reset();
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
}
