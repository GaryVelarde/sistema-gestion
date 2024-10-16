import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './plans-register.component.html',
    styleUrls: ['./plans-register.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PlansRegisterComponent implements OnInit, OnDestroy {
    actividadForm: FormGroup;
    previewData: any[] = [];
    rowspanData: any;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Planes', visible: true },
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private service: AuthService,
        private messageService: MessageService,
    ) {
        this.actividadForm = this.fb.group({
            tituloGeneral: ['', Validators.required],
            activities: this.fb.array([])
        });
    }

    ngOnInit() {
        // this.addActividad();
        this.watchActivities();
    }

    ngOnDestroy(): void {
        this.resetForm();
    }

    get activities() {
        return this.actividadForm.get('activities') as FormArray;
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

    tasks(indexActividad: number): FormArray {
        return this.activities.at(indexActividad).get('tasks') as FormArray;
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
    
    savePlan() {
            const formData = this.actividadForm.value;
            console.log('Título General:', formData.tituloGeneral);
            console.log('activities:', formData.activities);
            console.log('rq', this.generateRequestData())
            this.callPostPlanRegister();
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

    shouldShowRowspan(rowIndex: number): boolean {
        if (rowIndex === 0) return true;
        const currentCodAct = this.previewData[rowIndex].codAct;
        const previousCodAct = this.previewData[rowIndex - 1].codAct;
        return currentCodAct !== previousCodAct;
    }

    getRowspan(codAct: number): number {
        return this.rowspanData[codAct] || 1;
    }

    watchActivities(): void {
        this.actividadForm.valueChanges.pipe().subscribe(
            () => {
                this.showPreview();
            })
    }
    
    backList() {
        this.router.navigate(['/pages/planes'])
    }

    generateRequestData() {
        const formValue = this.actividadForm.value;
    
        const requestData = {
            title: formValue.tituloGeneral,
            activities: formValue.activities.map((actividad: any, indexActividad: number) => ({
                code_activity: `${actividad.activityCode}`,
                description_activity: actividad.description,
                tasks: actividad.tasks.map((tarea: any) => ({
                    code_task: tarea.taskCode,
                    description_task: tarea.description,
                    months: tarea.months.join(','),
                    comment: tarea.comment || ''
                }))
            }))
        };
    
        return [requestData];
    }

    callPostPlanRegister() {
        const request = this.generateRequestData();
        this.service.postPlanRegister(request).pipe().subscribe(
            (res: any) => {
            if(res.status) {
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'Confirmación',
                    detail: 'Lo datos han sido guardados.',
                    life: 3000,
                });
                this.resetForm();
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

    resetForm() {
        this.actividadForm.reset({
            tituloGeneral: '', 
            activities: [] 
        });
        this.activities.clear();
        // this.addActividad();
    }
}