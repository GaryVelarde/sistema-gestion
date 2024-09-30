import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoaderService } from 'src/app/layout/service/loader.service';

@Component({
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class BudgetComponent implements OnInit {
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Presupuesto', visible: true },
    ];
    actividadForm: FormGroup;
    previewDataMontos: any[] = [];
    rowspanData: any = {};

    constructor(private fb: FormBuilder) {
        this.actividadForm = this.fb.group({
            actividades: this.fb.array([])  // Un array para múltiples actividades
        });
    }

    ngOnInit() {
        this.addActividad();
        this.watchActivities();
    }

    onSubmit() {
        if (this.actividadForm.valid) {
            this.showPreviewWithMontos();
            // Lógica adicional si es necesario
        } else {
            // Manejo de formulario inválido
        }
    }

    // Obtener el FormArray de actividades
    get actividades() {
        return this.actividadForm.get('actividades') as FormArray;
    }

    // Crear una nueva actividad
    newActividad(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required],  // Descripción de la actividad
            tareas: this.fb.array([])  // Cada actividad puede tener múltiples tareas
        });
    }

    // Añadir actividad
    addActividad() {
        this.actividades.push(this.newActividad());
    }

    // Obtener el FormArray de tareas de una actividad específica
    tareas(indexActividad: number): FormArray {
        return this.actividades.at(indexActividad).get('tareas') as FormArray;
    }

    // Crear una nueva tarea
    newTarea(): FormGroup {
        return this.fb.group({
            descripcion: ['', Validators.required],  // Descripción de la tarea
            montos: this.fb.array(Array(12).fill(null)),  // Arreglo para los 12 meses con montos opcionales
            comentario: ['']  // Comentario opcional
        });
    }

    // Añadir tarea a una actividad específica
    addTarea(indexActividad: number) {
        this.tareas(indexActividad).push(this.newTarea());
    }

    // Guardar el formulario y generar la vista previa
    showPreviewWithMontos() {
        const formValue = this.actividadForm.value;
        this.previewDataMontos = formValue.actividades.map((actividad: any, i: number) => {
            return actividad.tareas.map((tarea: any, j: number) => {
                return {
                    codAct: i + 1,
                    actividadFuncional: actividad.descripcion,
                    codTarea: `${i + 1}.${j + 1}`,
                    tarea: tarea.descripcion,
                    avances: tarea.comentario || '',
                    montos: tarea.montos  // Aquí agregamos los montos por mes
                };
            });
        }).flat();

        // Cálculo de rowspan por actividad
        this.rowspanData = this.previewDataMontos.reduce((acc: any, curr: any) => {
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
        const currentCodAct = this.previewDataMontos[rowIndex].codAct;
        const previousCodAct = this.previewDataMontos[rowIndex - 1].codAct;
        return currentCodAct !== previousCodAct;
    }

    // Función para obtener el valor de rowspan
    getRowspan(codAct: number): number {
        return this.rowspanData[codAct] || 1;
    }

    getMesNombre(index: number): string {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return meses[index];
    }

    watchActivities(): void {
        this.actividadForm.valueChanges.pipe().subscribe(
            () => {
                this.showPreviewWithMontos();
            })
    }

}