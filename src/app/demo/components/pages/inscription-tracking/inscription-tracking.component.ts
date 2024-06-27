import { Component, ElementRef, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { IUsuario } from 'src/app/demo/api/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './inscription-tracking.component.html',
    styleUrls: ['./inscription-tracking.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class InscriptionTrackingComponent implements OnInit {
    products: Product[] = [];

    product: Product = {};

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
        },
        {
            name: 'Alice Smith',
            content:
                'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        // Agrega más elementos según sea necesario
    ];
    modalUserDetail = false;
    inscriptionState = '';

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

    inscriptionSelected: any;

    userDetailSelected: IUsuario;
    titleModalDetailIserSelected: string = '';
    public commentsForm: FormGroup;
    public tasksForm: FormGroup;
    private _comment: FormControl = new FormControl('', [Validators.required]);
    private _taskDescription: FormControl = new FormControl('', [
        Validators.required,
    ]);

    get comment() {
        return this._comment;
    }
    get taskDescription() {
        return this._taskDescription;
    }

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService,
        private service: AuthService,
        private elRef: ElementRef
    ) {
        this.commentsForm = this.fb.group({
            comment: this.comment,
        });
        this.tasksForm = this.fb.group({
            taskDescription: this.taskDescription,
        });
    }

    ngOnInit() {
        this.inscriptionSelected = this.registros[0];
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

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    openModalUserDetail(user: IUsuario) {
        this.titleModalDetailIserSelected = 'Detalle de ' + user.nombre;
        this.userDetailSelected = user;
        this.modalUserDetail = true;
    }

    viewDetailsInscription(data: any) {
        if (data) {
            this.inscriptionSelected = data;
            this.inscriptionState = data.inscripciones[0].estado;
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

    showEdition() {}

    goToReview() {
        this.inscriptionState = 'En revisión';
    }

    goToObserved() {
        this.inscriptionState = 'Observado';
    }

    goToCancelation() {
        this.confirmationService.confirm({
            header: 'Confirmación',
            message:
                'Estás a punto de cancelar esta inscripción, ¿estás seguro(a)?.',
            acceptIcon: 'pi pi-check mr-2',
            rejectIcon: 'pi pi-times mr-2',
            rejectButtonStyleClass: 'p-button-sm',
            acceptButtonStyleClass: 'p-button-outlined p-button-sm',
            accept: () => {
                this.inscriptionState = 'Cancelado';
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'Confirmado',
                    detail: 'Se ha realizado la cencelación de la inscripción.',
                    life: 3000,
                });
            },
            reject: () => {},
        });
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
    }

    isTaskDone(task: any): any {
        return {
            'task-done': task.checked,
        };
    }

    removeTask(taskId: string) {
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            this.tasks.splice(index, 1);
        }
    }
    

    countTask(taskId: string): void {
        this.tasks.forEach((task) => {
        
            console.log(
                `Task ${task.id}: ${task.description} - Checked: ${task.checked}`
            );
            // Aquí puedes realizar la acción que necesites para cada tarea
        });
    }

    addComment(): void {
        if (this.comment.value) {
            this.comments.push({
                name: 'Gary Velarde',
                content: this.comment.value,
            });
            this.comment.reset();
            this.scrollDown();
        }
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
}
