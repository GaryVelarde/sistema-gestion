import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/demo/api/product';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize } from 'rxjs';

@Component({
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [MessageService],
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

    rowsPerPageOptions = [5, 10, 20];

    userData = [];

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
        { name: 'X', code: 'X' },
    ];
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Gestión de usuarios' },
        { label: 'Usuarios', visible: true },
    ];
    columnTitles: string[] = [
        'Código',
        'Nombres completos',
        'Correo',
        'Celular',
        'Estado',
        ''
    ];
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    userDetailSelected: any;
    titleModalDetailIserSelected: string = '';
    getUserProcess = '';
    messageError = 'No se ha podido cargar la lista de usuarios. Por favor vuelva a intentarlo más tarde.'
    public userForm: FormGroup;
    private _role: FormControl = new FormControl('', [Validators.required]);
    private _name: FormControl = new FormControl('', [Validators.required]);
    private _lastName: FormControl = new FormControl('', [Validators.required]);
    private _email: FormControl = new FormControl('', [Validators.required]);
    private _number: FormControl = new FormControl('', [Validators.required]);
    private _code: FormControl = new FormControl('', [Validators.required]);
    private _egressDate: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _cycle: FormControl = new FormControl('', [Validators.required]);
    private _career: FormControl = new FormControl('', [Validators.required]);
    private _line: FormControl = new FormControl('', [Validators.required]);
    private _subLine: FormControl = new FormControl('', [Validators.required]);
    private _reviewer: FormControl = new FormControl(false);
    private _adviser: FormControl = new FormControl(false);
    private _jury: FormControl = new FormControl(false);

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

    constructor(
        private messageService: MessageService,
        private fb: FormBuilder,
        private service: AuthService,
        private loaderService: LoaderService,
    ) {
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
        this.callGetUserList();
        this.watchRoleSelected();
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
            }
        });
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
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
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
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
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

    openModalUserDetail(user: any) {
        this.titleModalDetailIserSelected = 'Detalle de ' + user.nombre;
        this.userDetailSelected = user;
        this.modalNewUser = true;
        this.setUserDataDetails(user);
    }

    setUserDataDetails(user: any) {
        console.log(this.adviser.value);
        console.log(user)
        if (user.role) {
            this.role.patchValue({ name: user.role, code: user.role })
            this.name.setValue(user.name);
            this.lastName.setValue(user.surnames);
            this.code.setValue(user.code);
            this.number.setValue(user.phone);
            this.email.setValue(user.email);

            switch (user.role) {
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
                    this.line.setValue(user.line);
                    this.subLine.setValue(user.sublines);
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
                    this.cycle.setValue({ name: user.cycle, code: user.cycle },)
                    this.career.setValue(user.career);
                    break;
                case 'Semillero':
                    this.removeControlForDocente();
                    this.removeControlForEgresado();
                    this.removeControlForEstudiante();
                    break;
            }
        }
    }

    callGetUserList() {
        this.getUserProcess = 'charging';
        this.service.getUserList().subscribe(
            (res) => {
                this.getUserProcess = 'complete';
                this.userData = res;
                console.log(res);
            },
            (error) => {
                // Handle the error in the subscription if necessary
                this.getUserProcess = 'error';
                console.log('Error in subscription:', error);
            }
        );
    }

    hableInsertOrUpdateUser() {
        this.userDetailSelected.id ? this.callPutUser()
            : this.callPostNewUser()
    }

    callPostNewUser() {
        this.loaderService.show();
        let rq = this.createRequest();
        console.log(rq);
        this.service.postCreateNewUser(rq).pipe(
            finalize(() => {
                setTimeout(() => {
                    this.loaderService.hide(); // Ocultar el loader después de 800ms
                }, 800);
            })
        ).subscribe(
            (res) => {
                if (res.status) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'El usuario se ha creado!',
                        life: 3000,
                    });
                }
                console.log(res);
            }, (error) => {

            });
    }

    createRequest() {
        let rq = {};
        switch (this.role.value.code) {
            case 'Docente':
                rq = {
                    role: this.role.value.code,
                    name: this.name.value,
                    surnames: this.lastName.value,
                    email: this.email.value,
                    phone: this.number.value,
                    code: this.code.value,
                    career: this.career.value,
                    line: this.line.value,
                    sublines: this.subLine.value,
                    is_reviewer: this.reviewer.value ? true : false,
                    is_advisor: this.adviser.value ? true : false,
                    is_jury: this.jury.value ? true : false,
                };
                break;
            case 'UDI':
                rq = {
                    role: this.role.value.code,
                    name: this.name.value,
                    surnames: this.lastName.value,
                    email: this.email.value,
                    phone: this.number.value,
                    code: this.code.value,
                };
                break;
            case 'Egresado':
                rq = {
                    role: this.role.value.code,
                    name: this.name.value,
                    surnames: this.lastName.value,
                    email: this.email.value,
                    phone: this.number.value,
                    code: this.code.value,
                    discharge_date: this.egressDate.value,
                    career: this.career.value,
                };
                break;
            case 'Semillero':
                rq = {
                    role: this.role.value.code,
                    name: this.name.value,
                    surnames: this.lastName.value,
                    email: this.email.value,
                    phone: this.number.value,
                    code: this.code.value,
                    cycle: this.cycle.value.code,
                };
                break;
            case 'Estudiante':
                rq = {
                    role: this.role.value.code,
                    name: this.name.value,
                    surnames: this.lastName.value,
                    email: this.email.value,
                    phone: this.number.value,
                    code: this.code.value,
                    cycle: this.cycle.value.code,
                    career: this.career.value,
                };
                break;
        }
        return rq;
    }

    handleReload(reload: boolean) {
        if (reload) {
            this.callGetUserList();
        }
    }

    callPutUser() {
        this.modalNewUser = false;
        this.loaderService.show();
        let rq = this.createRequest();
        this.service.putUser(this.userDetailSelected.id, rq).pipe(
            finalize(() => {
                setTimeout(() => {
                    this.loaderService.hide(); // Ocultar el loader después de 800ms
                }, 800);
            })
        ).subscribe(
            (res: any) => {
                if(res.status){
                    this.callGetUserList();
                }
                console.log(res);
            }, (error) => {
                console.error(error);
            })
    }

    clearValues() {

    }
}
