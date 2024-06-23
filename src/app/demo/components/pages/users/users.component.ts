import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUsuario } from 'src/app/demo/api/user';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [MessageService]
})
export class UsersComponent implements OnInit {

    modalNewUser: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols = [
        { field: 'codigo', header: 'Código' },
        { field: 'nombre', header: 'Nombres completos' },
        { field: 'email', header: 'Correo' },
        { field: 'rol', header: 'Rol' },
        { field: 'estado', header: 'Estado' },
    ];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    userData = [
        {
            "id": 1,
            "rol": "UDI",
            "nombre": "Cesar",
            "apellidos": "Jauregui",
            "email": "cesar2@test.com",
            "celular": 123456789,
            "codigo": 12164015,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-09T00:54:24.000000Z",
            "updated_at": "2024-06-09T00:54:24.000000Z"
        },
        {
            "id": 2,
            "rol": "UDI",
            "nombre": "Antonio",
            "apellidos": "Jauregui",
            "email": "cesar19@test.com",
            "celular": 1234567891,
            "codigo": 12164016,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-09T00:54:49.000000Z",
            "updated_at": "2024-06-09T00:54:49.000000Z"
        },
        {
            "id": 3,
            "rol": "UDI",
            "nombre": "Maria",
            "apellidos": "Perez",
            "email": "maria.perez@test.com",
            "celular": 987654321,
            "codigo": 12164017,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T01:10:30.000000Z",
            "updated_at": "2024-06-10T01:10:30.000000Z"
        },
        {
            "id": 4,
            "rol": "UDI",
            "nombre": "Luis",
            "apellidos": "Gonzalez",
            "email": "luis.gonzalez@test.com",
            "celular": 192837465,
            "codigo": 12164018,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T01:20:15.000000Z",
            "updated_at": "2024-06-10T01:20:15.000000Z"
        },
        {
            "id": 5,
            "rol": "UDI",
            "nombre": "Ana",
            "apellidos": "Martinez",
            "email": "ana.martinez@test.com",
            "celular": 564738291,
            "codigo": 12164019,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T01:30:45.000000Z",
            "updated_at": "2024-06-10T01:30:45.000000Z"
        },
        {
            "id": 6,
            "rol": "UDI",
            "nombre": "Jorge",
            "apellidos": "Lopez",
            "email": "jorge.lopez@test.com",
            "celular": 738291645,
            "codigo": 12164020,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T01:40:50.000000Z",
            "updated_at": "2024-06-10T01:40:50.000000Z"
        },
        {
            "id": 7,
            "rol": "UDI",
            "nombre": "Elena",
            "apellidos": "Rodriguez",
            "email": "elena.rodriguez@test.com",
            "celular": 846375920,
            "codigo": 12164021,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T01:50:10.000000Z",
            "updated_at": "2024-06-10T01:50:10.000000Z"
        },
        {
            "id": 8,
            "rol": "UDI",
            "nombre": "Pedro",
            "apellidos": "Ramirez",
            "email": "pedro.ramirez@test.com",
            "celular": 564839271,
            "codigo": 12164022,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:00:30.000000Z",
            "updated_at": "2024-06-10T02:00:30.000000Z"
        },
        {
            "id": 9,
            "rol": "UDI",
            "nombre": "Laura",
            "apellidos": "Hernandez",
            "email": "laura.hernandez@test.com",
            "celular": 284756193,
            "codigo": 12164023,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:10:45.000000Z",
            "updated_at": "2024-06-10T02:10:45.000000Z"
        },
        {
            "id": 10,
            "rol": "UDI",
            "nombre": "Marta",
            "apellidos": "Cruz",
            "email": "marta.cruz@test.com",
            "celular": 193847260,
            "codigo": 12164024,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:20:15.000000Z",
            "updated_at": "2024-06-10T02:20:15.000000Z"
        },
        {
            "id": 11,
            "rol": "UDI",
            "nombre": "Carlos",
            "apellidos": "Garcia",
            "email": "carlos.garcia@test.com",
            "celular": 564738291,
            "codigo": 12164025,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:30:15.000000Z",
            "updated_at": "2024-06-10T02:30:15.000000Z"
        },
        {
            "id": 12,
            "rol": "UDI",
            "nombre": "Sofia",
            "apellidos": "Martinez",
            "email": "sofia.martinez@test.com",
            "celular": 738291645,
            "codigo": 12164026,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:40:50.000000Z",
            "updated_at": "2024-06-10T02:40:50.000000Z"
        },
        {
            "id": 13,
            "rol": "UDI",
            "nombre": "Jorge",
            "apellidos": "Lopez",
            "email": "jorge.lopez@test.com",
            "celular": 846375920,
            "codigo": 12164027,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T02:50:10.000000Z",
            "updated_at": "2024-06-10T02:50:10.000000Z"
        },
        {
            "id": 14,
            "rol": "UDI",
            "nombre": "Elena",
            "apellidos": "Rodriguez",
            "email": "elena.rodriguez@test.com",
            "celular": 564839271,
            "codigo": 12164028,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:00:30.000000Z",
            "updated_at": "2024-06-10T03:00:30.000000Z"
        },
        {
            "id": 15,
            "rol": "UDI",
            "nombre": "Pedro",
            "apellidos": "Ramirez",
            "email": "pedro.ramirez@test.com",
            "celular": 284756193,
            "codigo": 12164029,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:10:45.000000Z",
            "updated_at": "2024-06-10T03:10:45.000000Z"
        },
        {
            "id": 16,
            "rol": "UDI",
            "nombre": "Laura",
            "apellidos": "Hernandez",
            "email": "laura.hernandez@test.com",
            "celular": 193847260,
            "codigo": 12164030,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:20:15.000000Z",
            "updated_at": "2024-06-10T03:20:15.000000Z"
        },
        {
            "id": 17,
            "rol": "UDI",
            "nombre": "Marta",
            "apellidos": "Cruz",
            "email": "marta.cruz@test.com",
            "celular": 876543210,
            "codigo": 12164031,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:30:15.000000Z",
            "updated_at": "2024-06-10T03:30:15.000000Z"
        },
        {
            "id": 18,
            "rol": "UDI",
            "nombre": "Carlos",
            "apellidos": "Garcia",
            "email": "carlos.garcia@test.com",
            "celular": 765432198,
            "codigo": 12164032,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:40:15.000000Z",
            "updated_at": "2024-06-10T03:40:15.000000Z"
        },
        {
            "id": 19,
            "rol": "UDI",
            "nombre": "Sofia",
            "apellidos": "Martinez",
            "email": "sofia.martinez@test.com",
            "celular": 654321987,
            "codigo": 12164033,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T03:50:15.000000Z",
            "updated_at": "2024-06-10T03:50:15.000000Z"
        },
        {
            "id": 20,
            "rol": "UDI",
            "nombre": "Jorge",
            "apellidos": "Lopez",
            "email": "jorge.lopez@test.com",
            "celular": 543219876,
            "codigo": 12164034,
            "fecha_egreso": null,
            "ciclo": null,
            "carrera": "Ingenieria de sistemas",
            "linea": null,
            "sub_lineas": null,
            "es_revisor": 0,
            "es_asesor": 0,
            "es_jurado": 0,
            "estado": "Habilitado",
            "email_verified_at": null,
            "created_at": "2024-06-10T04:00:15.000000Z",
            "updated_at": "2024-06-10T04:00:15.000000Z"
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
        this.watchRoleSelected();
        this.productService.getProducts().then(data => this.products = data);

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    watchRoleSelected() {
        this.role.valueChanges.pipe().subscribe((role: any) => {
            if (role) {
                switch (role.code) {
                    case 'UDI':
                        this.removeControlForDocente();
                        this.removeCareerControl();
                        this.removeControlForEgresado();
                        this.removeControlForEstudiante();
                        break;
                    case 'Docente':
                        this.addControlForDocente();
                        this.removeControlForEstudiante();
                        this.removeControlForEgresado();
                        break;
                    case 'Egresado':
                        this.addControlForEgresado();
                        this.removeControlForDocente();
                        this.removeControlForEstudiante();
                        break;
                    case 'Estudiante':
                        this.addControlForEstudiante();
                        this.removeControlForDocente();
                        this.removeControlForEgresado();
                        break;
                    case 'Semillero':
                        this.removeControlForDocente();
                        this.removeControlForEgresado();
                        this.removeControlForEstudiante();
                        break;
                }
                console.log(role);
            }
        })
    }

    addControlForDocente() {
        this.userForm.addControl('career', this.career);
        this.userForm.addControl('line', this.line);
        this.userForm.addControl('subLine', this.subLine);
        this.userForm.addControl('reviewer', this.reviewer);
        this.userForm.addControl('adviser', this.adviser);
        this.userForm.addControl('jury', this.jury);
    }

    addControlForEstudiante() {
        this.userForm.addControl('career', this.career);
        this.userForm.addControl('cycle', this.cycle);
    }

    addControlForEgresado() {
        this.userForm.addControl('career', this.career);
        this.userForm.addControl('egressDate', this.egressDate);
    }
    

    removeControlForDocente() {
        this.userForm.removeControl('line');
        this.userForm.removeControl('subLine');
        this.userForm.removeControl('reviewer');
        this.userForm.removeControl('adviser');
        this.userForm.removeControl('jury');
    }

    removeControlForEstudiante() {
        this.userForm.removeControl('cycle');
    }

    removeControlForEgresado() {
        this.userForm.removeControl('egressDate');
    }

    removeCareerControl() {
        this.userForm.removeControl('career');
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.modalNewUser = true;
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
}
