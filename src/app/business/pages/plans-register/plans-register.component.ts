import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/layout/service/loader.service';

@Component({
    templateUrl: './plans-register.component.html',
    styleUrls: ['./plans-register.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PlansRegisterComponent implements OnInit {
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
    ) {
        this.actividadForm = this.fb.group({
            tituloGeneral: ['', Validators.required],
            actividades: this.fb.array([])
        });
        
    }

    ngOnInit() {
        this.addActividad();
        this.watchActivities();
    }

    get actividades() {
        return this.actividadForm.get('actividades') as FormArray;
    }

    newActividad(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required],
            tareas: this.fb.array([])
        });
    }

    addActividad() {
        this.actividades.push(this.newActividad());
    }

    removeActividad(index: number) {
        this.actividades.removeAt(index);
    }

    tareas(indexActividad: number): FormArray {
        return this.actividades.at(indexActividad).get('tareas') as FormArray;
    }

    newTarea(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required],
            meses: this.fb.array(Array(12).fill(false)),
            comentario: [''] 
        });
    }

    addTarea(indexActividad: number) {
        this.tareas(indexActividad).push(this.newTarea());
    }

    removeTarea(indexActividad: number, indexTarea: number) {
        this.tareas(indexActividad).removeAt(indexTarea);
    }

    onSubmit() {
        if (this.actividadForm.valid) {
            const formData = this.actividadForm.value;
            console.log('Título General:', formData.tituloGeneral);
            console.log('Actividades:', formData.actividades);
        }
    }
    

    getMesNombre(index: number): string {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return meses[index];
    }

    showPreview() {
        const formValue = this.actividadForm.value;
        this.previewData = formValue.actividades.map((actividad: any, i: number) => {
            return actividad.tareas.map((tarea: any, j: number) => {
                const meses = tarea.meses.map((mes: boolean) => (mes ? '<i class="pi pi-times"></i>' : ''));
                return {
                    codAct: i + 1,
                    actividadFuncional: actividad.descripcion,
                    codTarea: `${i + 1}.${j + 1}`,
                    tarea: tarea.descripcion,
                    avances: tarea.comentario || '',
                    meses: meses
                };
            });
        }).flat();
    
        console.log('Título General:', formValue.tituloGeneral);
    
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
        if (rowIndex === 0) return true; // Siempre mostrar en la primera fila
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
        this.router.navigate(['/pages/plans'])
    }
}