import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/layout/service/loader.service';

@Component({
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class PlansComponent implements OnInit {
    actividadForm: FormGroup;
    previewData: any[] = [];
    rowspanData: any;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Planes', visible: true },
    ];

    constructor(
        private loaderService: LoaderService,
        private fb: FormBuilder
    ) {
        this.actividadForm = this.fb.group({
            tituloGeneral: ['', Validators.required], // Título general del formulario
            actividades: this.fb.array([]) // Un array para múltiples actividades
        });
        
    }

    ngOnInit() {
        this.addActividad();
        this.watchActivities();
    }

    // Obtener el FormArray de actividades
    get actividades() {
        return this.actividadForm.get('actividades') as FormArray;
    }

    // Crear una nueva actividad
    newActividad(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required], // Descripción de la actividad
            tareas: this.fb.array([]) // Cada actividad puede tener múltiples tareas
        });
    }

    // Añadir actividad
    addActividad() {
        this.actividades.push(this.newActividad());
    }

    // Eliminar actividad
    removeActividad(index: number) {
        this.actividades.removeAt(index);
    }

    // Obtener el FormArray de tareas de una actividad específica
    tareas(indexActividad: number): FormArray {
        return this.actividades.at(indexActividad).get('tareas') as FormArray;
    }

    // Crear una nueva tarea
    newTarea(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required], // Descripción de la tarea
            meses: this.fb.array(Array(12).fill(false)), // Arreglo para los 12 meses
            comentario: [''] // Comentario opcional
        });
    }

    // Añadir tarea a una actividad específica
    addTarea(indexActividad: number) {
        this.tareas(indexActividad).push(this.newTarea());
    }

    // Eliminar tarea de una actividad específica
    removeTarea(indexActividad: number, indexTarea: number) {
        this.tareas(indexActividad).removeAt(indexTarea);
    }

    // Guardar el formulario
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
    
        // Añadir el título general al preview
        console.log('Título General:', formValue.tituloGeneral);
    
        // Cálculo de rowspan por actividad
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

    // Función para determinar si mostrar rowspan en la actividad funcional
    shouldShowRowspan(rowIndex: number): boolean {
        if (rowIndex === 0) return true; // Siempre mostrar en la primera fila
        const currentCodAct = this.previewData[rowIndex].codAct;
        const previousCodAct = this.previewData[rowIndex - 1].codAct;
        return currentCodAct !== previousCodAct;
    }

    // Función para obtener el valor de rowspan
    getRowspan(codAct: number): number {
        return this.rowspanData[codAct] || 1;
    }

    watchActivities(): void {
        this.actividadForm.valueChanges.pipe().subscribe(
            () => {
                this.showPreview();
            })
    }
}