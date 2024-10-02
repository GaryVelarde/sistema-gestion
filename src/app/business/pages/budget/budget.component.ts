import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

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
    testData: any[] = [
        {
            tituloGeneral: 'Plan de Actividades 2024',
            actividades: [
                {
                    descripcion: 'Desarrollo de la plataforma web',
                    tareas: [
                        {
                            descripcion: 'Crear la estructura del frontend',
                            meses: [true, false, false, true, false, false, false, false, false, false, false, false],
                            comentario: 'La estructura básica está completa.'
                        },
                        {
                            descripcion: 'Implementar autenticación',
                            meses: [false, false, true, true, true, false, false, false, false, false, false, false],
                            comentario: 'Autenticación implementada, falta testing.'
                        }
                    ]
                },
                {
                    descripcion: 'Pruebas de calidad y despliegue',
                    tareas: [
                        {
                            descripcion: 'Escribir pruebas unitarias',
                            meses: [false, false, false, false, true, true, false, false, false, false, false, false],
                            comentario: 'Pruebas unitarias en progreso.'
                        }
                    ]
                }
            ]
        },
        {
            tituloGeneral: 'Plan de Mejoras 2024',
            actividades: [
                {
                    descripcion: 'Optimización del backend',
                    tareas: [
                        {
                            descripcion: 'Mejorar la eficiencia de las consultas SQL',
                            meses: [false, true, true, false, false, false, true, false, false, false, false, false],
                            comentario: 'Consultas SQL optimizadas en un 50%.'
                        },
                        {
                            descripcion: 'Implementar caching',
                            meses: [false, false, false, false, true, true, true, false, false, false, false, false],
                            comentario: 'Falta implementar la capa de caching.'
                        }
                    ]
                },
                {
                    descripcion: 'Mejoras de seguridad',
                    tareas: [
                        {
                            descripcion: 'Auditar las políticas de seguridad',
                            meses: [false, false, false, false, false, true, true, false, false, false, false, false],
                            comentario: 'Auditoría de seguridad en progreso.'
                        }
                    ]
                }
            ]
        }
    ];

    selectedPlan: any;
    selectedActividad: any;
    selectedTarea: any;
    gastosIngresados: any[] = []; // Arreglo para almacenar los gastos ingresados
    gastoForm: FormGroup;


    constructor(private fb: FormBuilder) {
        this.gastoForm = this.fb.group({
            gastoEspecifico: ['', Validators.required],
            meses: this.fb.array(Array(12).fill(0)), // Inicializa el array de meses como montos (0)
            rubroContable: ['', Validators.required]
        });

    }

    ngOnInit(): void { }

    onPlanChange() {
        this.selectedActividad = null;
        this.selectedTarea = null;
    }

    onActividadChange() {
        this.selectedTarea = null;
    }

    onTareaChange() {
        // Este método puede estar vacío, pero lo puedes usar para acciones adicionales si es necesario
    }

    agregarGasto() {
        if (!this.selectedTarea) {
            alert("Por favor, selecciona una tarea antes de agregar un gasto.");
            return;
        }

        const newGasto = {
            gastoEspecifico: this.gastoForm.value.gastoEspecifico,
            meses: this.gastoForm.value.meses, // Ahora guarda los montos
            rubroContable: this.gastoForm.value.rubroContable,
            tarea: this.selectedTarea.descripcion,
            actividad: this.selectedActividad.descripcion
        };

        // Agregar el nuevo gasto al array de gastos ingresados
        this.gastosIngresados.push(newGasto);

        // Limpiar el formulario
        this.gastoForm.reset();
        this.gastoForm.setControl('meses', this.fb.array(Array(12).fill(0))); // Reinicia los meses a 0
        this.selectedTarea = null; // Reinicia la tarea seleccionada

    }


    calcularTotal(meses: number[]): number {
        return meses.reduce((acc, monto) => acc + monto, 0); // Sumar todos los montos ingresados en los meses
    }

    totalMeses(): number[] {
        const totalPorMes = new Array(12).fill(0);
        this.gastosIngresados.forEach(gasto => {
          gasto.meses.forEach((monto, index) => {
            totalPorMes[index] += monto; // Sumar los montos
          });
        });
        return totalPorMes;
      }
    


    calcularTotalTotal(): number {
        return this.gastosIngresados.reduce((acc, gasto) => {
            return acc + gasto.meses.reduce((sum, monto) => sum + monto, 0); // Sumar todos los montos ingresados
        }, 0);
    }


}