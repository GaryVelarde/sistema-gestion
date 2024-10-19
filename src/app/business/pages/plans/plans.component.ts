import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { ProductService } from 'src/app/demo/service/product.service';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss'],
    providers: [MessageService, ProductService],
})
export class PlansComponent implements OnInit {
    statusList = '';
    previewData: any[] = [];
    rowspanData: any;
    floatingBoard = false;
    messageError: string = 'Se produjo un error al cargar la lista de planes. Por favor, inténtelo de nuevo más tarde';
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Planes', visible: true },
    ];
    breadcrumbItemsDetail: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Planes' },
        { label: 'Detalle del Plan', visible: true },
    ];
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Plan',
        'Fecha de registro',
        ''
    ];
    responsiveOptions: any[] | undefined;
    registros = [];
    planSelected;
    planSelectedId = '';
    edition = false;
    actividadForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private service: AuthService,
        private loaderService: LoaderService,
        private messageService: MessageService,
    ) {
        this.actividadForm = this.fb.group({
            tituloGeneral: ['', Validators.required],
            activities: this.fb.array([])
        });
    }

    ngOnInit() {
        this.callGetPlans();
        this.watchActivities();
    }

    get activities() {
        return this.actividadForm.get('activities') as FormArray;
    }

    goToPlaneRegister() {
        this.router.navigate(['/pages/registro-planes'])
    }

    callGetPlans() {
        this.statusList = 'charging';
        this.service.getPlans().pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.statusList = 'complete';
                    this.registros = res.data;
                }
                console.log(res.data)
            }, (error) => {
                this.statusList = 'error';
            })
    }

    handleReload() {
        this.callGetPlans();
    }

    viewDetailsPlan(data: any) {
        this.loaderService.show();
        console.log(data);
        this.planSelected = data;
        this.planSelectedId = data.id;
        this.populateForm(this.planSelected);
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    backList() {
        this.loaderService.show();
        this.callGetPlans();
        this.planSelected = null;
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    getMonthValue(monthsString: string, index: number): string {
        const monthsArray = monthsString.split(',');
        return monthsArray[index] === 'true' ? '✖️' : '';
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    showEdition() {
        this.edition = true;
    }

    cancelEdition() {
        this.floatingBoard = false;
        this.populateForm(this.planSelected);
        this.edition = false;
    }

    populateForm(data: any) {
        this.actividadForm.patchValue({
            tituloGeneral: data.title,
        });
        this.activities.clear();
        data.activities.forEach((actividad: any, indexActividad: number) => {
            const actividadFormGroup = this.fb.group({
                id: [actividad.id],
                activityCode: [actividad.code_activity],
                description: [actividad.description_activity, Validators.required],
                tasks: this.fb.array([])
            });
            actividad.tasks.forEach((tarea: any, indexTarea: number) => {
                const tareaFormGroup = this.fb.group({
                    id: [tarea.id],
                    taskCode: [tarea.code_task],
                    description: [tarea.description_task, Validators.required],
                    months: this.fb.array(tarea.months.split(',').map((mes: string) => mes === 'true')),
                    comment: [tarea.comment || '']
                });
                (actividadFormGroup.get('tasks') as FormArray).push(tareaFormGroup);
            });
            this.activities.push(actividadFormGroup);
            this.showPreview();
        });
    }


    tasks(indexActividad: number): FormArray {
        return this.activities.at(indexActividad).get('tasks') as FormArray;
    }

    getMesNombre(index: number): string {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return months[index];
    }

    showPreview() {
        const formValue = this.actividadForm.value;
        this.previewData = formValue.activities.map((actividad: any, i: number) => {
            return actividad.tasks.map((tarea: any, j: number) => {
                const months = tarea.months.map((mes: boolean) => (mes ? '<i class="pi pi-times"></i>' : ''));
                return {
                    codAct: actividad.activityCode,
                    actividadFuncional: actividad.description,
                    taskCode: tarea.taskCode,
                    tarea: tarea.description,
                    avances: tarea.comment || '',
                    months: months
                };
            });
        }).flat();

        this.rowspanData = this.previewData.reduce((acc: any, curr: any) => {
            const codAct = curr.codAct;
            if (!acc[codAct]) {
                acc[codAct] = 1;
            } else {
                acc[codAct]++;
            }
            return acc;
        }, {});
    }

    watchActivities(): void {
        this.actividadForm.valueChanges.pipe().subscribe(
            () => {
                console.log('this.actividadForm', this.actividadForm.value)
                this.showPreview();
            })
    }

    newTarea(indexActividad: number): FormGroup {
        const tareaIndex = this.tasks(indexActividad).length + 1;
        return this.fb.group({
            taskCode: [`${indexActividad + 1}.${tareaIndex}`],
            description: ['', Validators.required],
            months: this.fb.array(Array(12).fill(false)),
            comment: ['']
        });
    }

    addTarea(indexActividad: number) {
        this.tasks(indexActividad).push(this.newTarea(indexActividad));
    }

    newActividad(): FormGroup {
        const actividadIndex = this.activities.length + 1;
        return this.fb.group({
            activityCode: [actividadIndex],
            description: ['', Validators.required],
            tasks: this.fb.array([])
        });
    }

    addActividad() {
        this.activities.push(this.newActividad());
    }

    removeTarea(indexActividad: number, indexTarea: number) {
        this.tasks(indexActividad).removeAt(indexTarea);
        this.updateTareasCodigos(indexActividad);
    }

    updateTareasCodigos(indexActividad: number) {
        const tasks = this.tasks(indexActividad);
        tasks.controls.forEach((tarea, j) => {
            tarea.get('taskCode')?.setValue(`${indexActividad + 1}.${j + 1}`);
        });
    }

    shouldShowRowspan(rowIndex: number): boolean {
        if (rowIndex === 0) return true;
        const currentCodAct = this.previewData[rowIndex].codAct;
        const previousCodAct = this.previewData[rowIndex - 1].codAct;
        return currentCodAct !== previousCodAct;
    }

    getRowspan(codAct: number): number {
        return this.rowspanData[codAct] || 1;
    }

    removeActividad(indexActividad: number) {
        this.activities.removeAt(indexActividad);
        this.updateActividadesCodigos();
    }

    updateActividadesCodigos() {
        this.activities.controls.forEach((actividad, i) => {
            actividad.get('activityCode')?.setValue(i + 1);
            this.updateTareasCodigos(i);
        });
    }

    generateRequest(): any {
        const formValue = this.actividadForm.value;
        const activities = formValue.activities.map((actividad: any) => {
            return {
                ...(actividad.id && { id: actividad.id }),
                code_activity: actividad.activityCode,
                description_activity: actividad.description,
                tasks: actividad.tasks.map((tarea: any) => {
                    return {
                        ...(tarea.id && { id: tarea.id }),
                        code_task: tarea.taskCode,
                        description_task: tarea.description,
                        months: tarea.months.map((mes: boolean) => mes ? 'true' : 'false').join(','),
                        comment: tarea.comment || ''
                    };
                })
            };
        });
        return {
            title: formValue.tituloGeneral,
            activities: activities
        };
    }

    saveEdition() {
        this.callPutPlansUpdate();
    }

    callPutPlansUpdate() {
        this.loaderService.show(true);
        const request = this.generateRequest();
        console.log(request)
        this.service.putPlansUpdate(this.planSelected.id, [request]).pipe(
            finalize(() => {
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.confirmUpdate(request);
                    this.edition = false;
                    this.floatingBoard = false;
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

    confirmUpdate(data: any) {
        this.planSelected = data;
        this.planSelected.id = this.planSelectedId;
    }

}