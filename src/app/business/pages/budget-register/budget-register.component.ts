import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { pipe, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './budget-register.component.html',
    styleUrls: ['./budget-register.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class BudgetRegisterComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    plans: any[] = [];
    activities: any[] = [];
    tasks: any[] = [];
    completedTaskIds: string[] = [];
    statusTask = '';
    statusActivity = '';
    statusListPlans = false;
    floatingBoard = false;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Nuevo presupuesto', visible: true },
    ];
    gastosIngresados: any[] = [];
    activitySelected: any;
    taskSelected: any;
    gastoForm: FormGroup;
    planForm: FormGroup;
    private _planSelected: FormControl = new FormControl({}, [Validators.required])

    get planSelected() {
        return this._planSelected;
    }

    constructor(
        private fb: FormBuilder,
        private service: AuthService,
        private router: Router,
        private messageService: MessageService
    ) {
        this.gastoForm = this.fb.group({
            gastoEspecifico: new FormControl('', Validators.required),
            meses: this.fb.array(Array(12).fill(0)),
            rubroContable: new FormControl('', Validators.required),
        });
        this.planForm = this.fb.group({
            planSelected: this.planSelected,
        });
    }

    ngOnInit(): void {
        this.callGetListPlans();
        this.watchPlanSelected();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearValues();
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
        this.markTaskAsDone();
        const newGasto = {
            gastoEspecifico: this.gastoForm.value.gastoEspecifico,
            meses: this.gastoForm.value.meses,
            rubroContable: this.gastoForm.value.rubroContable,
            taskCode: this.taskSelected.code_task,
            actividad: this.activitySelected.description_activity,
            activityCode: this.activitySelected.code_activity,
            activity_id: this.activitySelected.id,
            task_id: this.taskSelected.id,
        };

        console.log('newGasto', newGasto)

        // Agregar el nuevo gasto al array de gastos ingresados
        this.gastosIngresados.push(newGasto);
        console.log('this.gastosIngresados', this.gastosIngresados);

        // Limpiar el formulario
        this.gastoForm.reset();
        this.gastoForm.setControl('meses', this.fb.array(Array(12).fill(0)));
        this.taskSelected = null;

    }

    calcularTotal(meses: number[]): number {
        return meses.reduce((acc, monto) => acc + monto, 0);
    }

    totalMeses(): number[] {
        const totalPorMes = new Array(12).fill(0);
        this.gastosIngresados.forEach(gasto => {
            gasto.meses.forEach((monto, index) => {
                totalPorMes[index] += monto;
            });
        });
        return totalPorMes;
    }

    calcularTotalTotal(): number {
        return this.gastosIngresados.reduce((acc, gasto) => {
            return acc + gasto.meses.reduce((sum, monto) => sum + monto, 0);
        }, 0);
    }

    callGetListPlans() {
        this.statusListPlans = true;
        this.service.getListPlans().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                if (res.data) {
                    this.statusListPlans = false;
                    this.plans = res.data;
                }

            }, (error) => {

            })
    }

    watchPlanSelected() {
        this.planSelected.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
            (plan: any) => {
                if (plan.id) {
                    this.taskSelected = null;
                    this.activitySelected = null;
                    this.callGetListActivitybyPlan(plan.id);
                }
                console.log(plan)
            })
    }

    callGetListActivitybyPlan(id: string) {
        this.statusActivity = 'charging';
        this.service.getListActivityByPlan(id).pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                if (res.data) {
                    this.activities = res.data;
                    this.statusActivity = 'complete';

                }
            }, (error) => {
                this.statusActivity = 'error';

            })
    }

    activitySelection(activity: any): void {
        this.activities.forEach(a => a.selected = false);
        activity.selected = true;
        this.activitySelected = activity;
        this.callgetListTaskByActivity(activity.id);
        this.taskSelected = null;
        console.log(activity)
    }

    callgetListTaskByActivity(id: string) {
        this.statusTask = 'charging';
        this.service.getListTaskByActivity(id).pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                if (res.data) {
                    this.tasks = res.data;
                    this.setTasksAsCompleted();
                    this.statusTask = 'complete';
                }
            }, (error) => {
                this.statusTask = 'error';
            })
    }

    taskSelection(task: any): void {
        this.tasks.forEach(a => a.selected = false);
        task.selected = true;
        this.taskSelected = task;
        console.log(task)
    }

    clearTaskSelection(): void {
        this.tasks.forEach(task => task.selected = false);
        this.taskSelected = null;
    }

    generateRequest(tasks: any[]) {
        const planId = this.planSelected.value.id;

        const transformedExpenses: any[] = tasks.map((task) => ({
            specific_expense: task.gastoEspecifico,
            month_amount: task.meses.join(","),
            accounting_item: task.rubroContable ? task.rubroContable : '',
            task_id: task.task_id,
            activity_id: task.activity_id
        }));

        return {
            plan_id: planId,
            expenses: transformedExpenses
        };
    }

    callPostRegisterBudget() {
        const request = this.generateRequest(this.gastosIngresados);
        console.log('request', request)
        this.service.postRegisterBudget([request]).pipe(takeUntil(this.destroy$)).
            subscribe(
                (res: any) => {
                    if (res.status) {
                        this.messageService.add({
                            key: 'tst',
                            severity: 'info',
                            summary: 'Confirmación',
                            detail: 'Lo datos han sido guardados.',
                            life: 3000,
                        });
                        this.clearValues();
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

    backToList() {
        this.router.navigate(['/pages/presupuestos']);
    }

    save() {
        this.callPostRegisterBudget();
    }

    clearValues() {
        this.gastoForm.reset();
        this.planSelected.setValue(null);
        this.activitySelected = null;
        this.taskSelected = null;
        this.gastosIngresados = [];
    }

    

    markTaskAsDone(): void {
        if (!this.taskSelected) {
            alert("No hay una tarea seleccionada para marcar como hecha.");
            return;
        }
        this.taskSelected.done = true;
        this.addTaskFromCompleted(this.taskSelected.id);
        console.log(`Tarea ${this.taskSelected.code_task} marcada como hecha.`);
    }

    deleteGasto(gasto: any): void {
        const index = this.gastosIngresados.findIndex(
            item => item.activity_id === gasto.activity_id && item.task_id === gasto.task_id
        );
        if (index !== -1) {
            this.gastosIngresados.splice(index, 1);
            this.markTaskAsNotDone(gasto.task_id);
            this.removeTaskFromCompleted(gasto.task_id)
            this.clearTaskSelection();
        }
    }

    markTaskAsNotDone(taskId: string): void {
        const task = this.tasks.find(
            (task) => task.id === taskId
        );
        if (task) {
            task.done = false;
        }
    }

    addTaskFromCompleted(taskId: string): void {
        this.completedTaskIds.push(taskId);
        console.log('taskId', taskId);
    }

    removeTaskFromCompleted(taskId: string): void {
        const index = this.completedTaskIds.indexOf(taskId);
        if (index !== -1) {
            this.completedTaskIds.splice(index, 1);
        }
    }

    setTasksAsCompleted(): void {
        this.tasks.forEach(task => {
            if (this.completedTaskIds.includes(task.id)) {
                task.done = true;
            }
        });
        console.log('this.tasks', this.tasks)
    }


}