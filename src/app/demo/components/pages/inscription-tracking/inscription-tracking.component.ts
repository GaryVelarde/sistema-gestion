import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from 'src/app/demo/api/user';

@Component({
    templateUrl: './inscription-tracking.component.html',
    styleUrls: ['./inscription-tracking.component.scss'],
    providers: [MessageService]
})
export class InscriptionTrackingComponent implements OnInit {

    modalNewUser: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols = [
        { field: 'title', header: 'Título de tesis' },
        { field: 'name', header: 'Asesor' },
        { field: 'estado', header: 'Estado' },
    ];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    registros = [
        {
            "id": 12,
            "expediente": 1226,
            "escuela_profesional": "IET",
            "titulo_proyecto_tesis": "Desarrollo de una aplicación móvil para la gestión de tareas escolares",
            "numero_oficio": "124-114",
            "numero_resolucion": "113-114",
            "estado_general": "Inscripción",
            "inscripciones": [
                {
                    "id": 12,
                    "proceso_titulacion_id": 12,
                    "fecha_recepcion_facultad": "2205-01-15",
                    "fecha_aprobacion_UDI": "2024-06-08",
                    "estado": "Inscrito",
                    "docente": [
                        {
                            "id": 2,
                            "nombre": "César",
                            "apellidos": "Jauregui"
                        }
                    ],
                    "observaciones": [
                        {
                            "id": 12,
                            "inscripcion_id": 12,
                            "descripcion": "Observación",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ],
                    "archivos": [
                        {
                            "id": 7,
                            "inscripcion_id": 12,
                            "archivo": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ]
                }
            ],
            "egresados": [
                {
                    "id": 3,
                    "nombre": "María",
                    "apellidos": "Velarde",
                    "email": "maria@test.com",
                    "celular": 123456789
                },
                {
                    "id": 4,
                    "nombre": "Pedro",
                    "apellidos": "González",
                    "email": "pedro@test.com",
                    "celular": 123456789
                }
            ]
        },
        {
            "id": 13,
            "expediente": 1227,
            "escuela_profesional": "IET",
            "titulo_proyecto_tesis": "Análisis de la eficiencia energética en edificios inteligentes",
            "numero_oficio": "125-115",
            "numero_resolucion": "114-115",
            "estado_general": "Inscripción",
            "inscripciones": [
                {
                    "id": 13,
                    "proceso_titulacion_id": 13,
                    "fecha_recepcion_facultad": "2205-01-15",
                    "fecha_aprobacion_UDI": "2024-06-08",
                    "estado": "Inscrito",
                    "docente": [
                        {
                            "id": 3,
                            "nombre": "Luis",
                            "apellidos": "Pérez"
                        }
                    ],
                    "observaciones": [
                        {
                            "id": 13,
                            "inscripcion_id": 13,
                            "descripcion": "Observación",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ],
                    "archivos": [
                        {
                            "id": 8,
                            "inscripcion_id": 13,
                            "archivo": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ]
                }
            ],
            "egresados": [
                {
                    "id": 5,
                    "nombre": "Ana",
                    "apellidos": "López",
                    "email": "ana@test.com",
                    "celular": 123456789
                },
                {
                    "id": 6,
                    "nombre": "Roberto",
                    "apellidos": "García",
                    "email": "roberto@test.com",
                    "celular": 123456789
                }
            ]
        },
        {
            "id": 14,
            "expediente": 1228,
            "escuela_profesional": "IET",
            "titulo_proyecto_tesis": "Desarrollo de un sistema de gestión de inventario para una cadena de supermercados",
            "numero_oficio": "126-116",
            "numero_resolucion": "115-116",
            "estado_general": "Inscripción",
            "inscripciones": [
                {
                    "id": 14,
                    "proceso_titulacion_id": 14,
                    "fecha_recepcion_facultad": "2205-01-15",
                    "fecha_aprobacion_UDI": "2024-06-08",
                    "estado": "Inscrito",
                    "docente": [
                        {
                            "id": 4,
                            "nombre": "Carlos",
                            "apellidos": "Martínez"
                        }
                    ],
                    "observaciones": [
                        {
                            "id": 14,
                            "inscripcion_id": 14,
                            "descripcion": "Observación",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ],
                    "archivos": [
                        {
                            "id": 9,
                            "inscripcion_id": 14,
                            "archivo": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ]
                }
            ],
            "egresados": [
                {
                    "id": 7,
                    "nombre": "Sandra",
                    "apellidos": "Ramírez",
                    "email": "sandra@test.com",
                    "celular": 123456789
                },
                {
                    "id": 8,
                    "nombre": "Pedro",
                    "apellidos": "Pérez",
                    "email": "pedro@test.com",
                    "celular": 123456789
                }
            ]
        },
        {
            "id": 15,
            "expediente": 1229,
            "escuela_profesional": "IET",
            "titulo_proyecto_tesis": "Implementación de un sistema de gestión de recursos humanos para empresas",
            "numero_oficio": "127-117",
            "numero_resolucion": "116-117",
            "estado_general": "Inscripción",
            "inscripciones": [
                {
                    "id": 15,
                    "proceso_titulacion_id": 15,
                    "fecha_recepcion_facultad": "2205-01-15",
                    "fecha_aprobacion_UDI": "2024-06-08",
                    "estado": "Inscrito",
                    "docente": [
                        {
                            "id": 5,
                            "nombre": "Elena",
                            "apellidos": "Gómez"
                        }
                    ],
                    "observaciones": [
                        {
                            "id": 15,
                            "inscripcion_id": 15,
                            "descripcion": "Observación",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ],
                    "archivos": [
                        {
                            "id": 10,
                            "inscripcion_id": 15,
                            "archivo": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/lyPWqo2epLojcnfGOFDRz5mRHqai05Q3gx77Iygc.png",
                            "created_at": "2024-06-20T05:28:52.000000Z"
                        }
                    ]
                }
            ],
            "egresados": [
                {
                    "id": 9,
                    "nombre": "Miguel",
                    "apellidos": "Fernández",
                    "email": "miguel@test.com",
                    "celular": 123456789
                },
                {
                    "id": 10,
                    "nombre": "Laura",
                    "apellidos": "López",
                    "email": "laura@test.com",
                    "celular": 123456789
                }
            ]
        },
    ];

    modalUserDetail = false;

    roles: any[] = [
        { name: 'UDI', code: 'UDI' },
        { name: 'Docente', code: 'Docente' },
        { name: 'Egresado', code: 'Egresado' },
        { name: 'Estudiante', code: 'Estudiante' },
        { name: 'Semillero', code: 'Semillero' },
    ];
    cycles: any[] = [
        { name: 'I', code: 'I' },
        { name: 'II', code: 'II' },
        { name: 'III', code: 'III' },
        { name: 'IV', code: 'IV' },
        { name: 'V', code: 'V' },
        { name: 'VI', code: 'VI' },
        { name: 'VII', code: 'VII' },
        { name: 'VIII', code: 'VIII' },
        { name: 'IX', code: 'IX' },
        { name: 'X', code: 'X' }
    ];

    inscriptionSelected: any;

    userDetailSelected: IUsuario;
    titleModalDetailIserSelected: string = '';
    public userForm: FormGroup;
    private _role: FormControl = new FormControl('', [Validators.required]);
    private _name: FormControl = new FormControl('', [Validators.required]);
    private _lastName: FormControl = new FormControl('', [Validators.required]);
    private _email: FormControl = new FormControl('', [Validators.required]);
    private _number: FormControl = new FormControl('', [Validators.required]);
    private _code: FormControl = new FormControl('', [Validators.required]);
    private _egressDate: FormControl = new FormControl('', [Validators.required]);
    private _cycle: FormControl = new FormControl('', [Validators.required]);
    private _career: FormControl = new FormControl('', [Validators.required]);
    private _line: FormControl = new FormControl('', [Validators.required]);
    private _subLine: FormControl = new FormControl('', [Validators.required]);
    private _reviewer: FormControl = new FormControl('');
    private _adviser: FormControl = new FormControl('');
    private _jury: FormControl = new FormControl('');

    get role() {
        return this._role;
    }
    get name() {
        return this._name;
    }
    get lastName() {
        return this._lastName;
    }
    get email() {
        return this._email;
    }
    get number() {
        return this._number;
    }
    get code() {
        return this._code;
    }
    get egressDate() {
        return this._egressDate;
    }
    get cycle() {
        return this._cycle;
    }
    get career() {
        return this._career;
    }
    get line() {
        return this._line;
    }
    get subLine() {
        return this._subLine;
    }
    get reviewer() {
        return this._reviewer;
    }
    get adviser() {
        return this._adviser;
    }
    get jury() {
        return this._jury;
    }

    constructor(private productService: ProductService, private messageService: MessageService, private fb: FormBuilder) {
        this.userForm = this.fb.group({
            role: this.role,
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            number: this.number,
            code: this.code,
        });
    }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }



    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.modalNewUser = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(val => val.id !== this.product.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        this.product = {};
    }

    hideDialog() {
        this.modalNewUser = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            this.products = [...this.products];
            this.modalNewUser = false;
            this.product = {};
        }
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
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openModalUserDetail(user: IUsuario) {
        this.titleModalDetailIserSelected = 'Detalle de ' + user.nombre;
        this.userDetailSelected = user;
        this.modalUserDetail = true;
    }

    viewDetailsInscription(data: any){
        if(data){
            this.inscriptionSelected = data;
        }
    }

    backList(){
        this.inscriptionSelected = null;
    }
}
