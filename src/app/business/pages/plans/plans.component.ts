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
            actividades: this.fb.array([]) // Un array para múltiples actividades
        });
    }

    ngOnInit() {
        this.addActividad();
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
        console.log(this.actividadForm.value);
    }

    getMesNombre(index: number): string {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return meses[index];
    }
}