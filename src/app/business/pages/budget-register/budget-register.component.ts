import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { pipe } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './budget-register.component.html',
    styleUrls: ['./budget-register.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class BudgetRegisterComponent implements OnInit {
    plans: any[] = [];
    activities: any[] = [];
    tasks: any[] = [];
    statusListPlans = false;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Nuevo presupuesto', visible: true },
    ];
    gastosIngresados: any[] = []; // Arreglo para almacenar los gastos ingresados
    activitySelected: any;
    taskSelected: any;
    gastoForm: FormGroup;
    planForm: FormGroup;
    private _planSelected: FormControl = new FormControl({}, [Validators.required])

    get planSelected() {
        return this._planSelected;
    }

    constructor(private fb: FormBuilder, private service: AuthService) {
        this.gastoForm = this.fb.group({
            gastoEspecifico: ['', Validators.required],
            meses: this.fb.array(Array(12).fill(0)), // Inicializa el array de meses como montos (0)
            rubroContable: ['', Validators.required]
        });
        this.planForm = this.fb.group({
            planSelected: this.planSelected,
        });

    }

    ngOnInit(): void {
        this.callGetListPlans();
        this.watchPlanSelected();
    }

    onPlanChange() {
        this.activitySelected = null;
        this.taskSelected = null;
    }

    onActividadChange() {
        this.taskSelected = null;
    }

    onTareaChange() {
        // Este método puede estar vacío, pero lo puedes usar para acciones adicionales si es necesario
    }

    agregarGasto() {
        if (!this.taskSelected) {
            alert("Por favor, selecciona una tarea antes de agregar un gasto.");
            return;
        }

        const newGasto = {
            gastoEspecifico: this.gastoForm.value.gastoEspecifico,
            meses: this.gastoForm.value.meses, // Ahora guarda los montos
            rubroContable: this.gastoForm.value.rubroContable,
            taskCode: this.taskSelected.code_task,
            actividad: this.activitySelected.description_activity,
            activityCode: this.activitySelected.code_activity
        };

        // Agregar el nuevo gasto al array de gastos ingresados
        this.gastosIngresados.push(newGasto);
        console.log('this.gastosIngresados', this.gastosIngresados);

        // Limpiar el formulario
        this.gastoForm.reset();
        this.gastoForm.setControl('meses', this.fb.array(Array(12).fill(0))); // Reinicia los meses a 0
        this.taskSelected = null; // Reinicia la tarea seleccionada

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

    callGetListPlans() {
        this.statusListPlans = true;
        this.service.getListPlans().pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.statusListPlans = false;
                    this.plans = res.data;
                }

            }, (error) => {

            })
    }

    watchPlanSelected() {
        this.planSelected.valueChanges.pipe().subscribe(
            (plan: any) => {
                if (plan.id) {
                    this.callGetListActivitybyPlan(plan.id);
                }
                console.log(plan)
            })
    }

    callGetListActivitybyPlan(id: string) {
        this.service.getListActivityByPlan(id).pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.activities = res.data;
                }
            }, (error) => {

            })
    }

    activitySelection(activity: any): void {
        this.activities.forEach(a => a.selected = false);
        activity.selected = true;
        this.activitySelected = activity;
        this.callgetListTaskByActivity(activity.id);
        console.log(activity)
    }

    callgetListTaskByActivity(id: string) {
        this.service.getListTaskByActivity(id).pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.tasks = res.data;
                }
            }, (error) => {

            })
    }

    taskSelection(task: any): void {
        this.tasks.forEach(a => a.selected = false);
        task.selected = true;
        this.taskSelected = task;
        console.log(task)
    }

}