import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './budget.component.html',
    styleUrls: ['./budget.component.scss'],
    providers: [MessageService],
})
export class BudgetComponent implements OnInit {
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Presupuesto', visible: true },
    ];
    private destroy$ = new Subject<void>();
    messageError: string = 'Se produjo un error al cargar la lista de planes. Por favor, inténtelo de nuevo más tarde';
    statusList = '';
    registros = [];
    budgetSelected: any;
    floatingBoard = false;
    previewData = [];
    breadcrumbItemsDetail: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Presupuesto' },
        { label: 'Detalle del Presupuesto', visible: true },
    ];
    skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
    columnTitles: string[] = [
        'Presupuesto',
        ''
    ];
    gastosIngresados: any[] = [];
    edition = false;
    activities: any[] = [];
    tasks: any[] = [];
    statusActivity = '';
    activitySelected: any;
    statusTask = '';
    taskSelected: any;
    completedTaskIds: string[] = [];
    gastoForm: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private service: AuthService,
        private messageService: MessageService, private loaderServide: LoaderService,
    ) {
        this.gastoForm = this.fb.group({
            gastoEspecifico: new FormControl('', Validators.required),
            meses: this.fb.array(Array(12).fill(0)),
            rubroContable: new FormControl('', Validators.required),
        });
    }

    ngOnInit(): void {
        this.calGetBudgetList();
    }

    goToBudgetRegister() {
        this.router.navigate(['/pages/nuevo-presupuesto'])
    }

    calGetBudgetList() {
        this.statusList = 'charging';
        this.service.getBudget().pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.registros = res.data;
                    this.statusList = 'complete';
                }

            }, (error) => {
                this.statusList = 'error';
            })
    }

    viewDetailsBudget(data: any) {
        console.log('data', data)
        this.gastosIngresados = this.formatData(data.expenses);
        this.budgetSelected = data;
        this.extractTaskIdsByDoneTasks(data.expenses)
    }

    formatData(expenses: any[]): any[] {
        return expenses.map(expense => ({
            activityCode: expense.code_activity,
            actividad: expense.description_activity,
            taskCode: expense.code_task,
            gastoEspecifico: expense.specific_expense,
            meses: expense.month_amount.split(',').map(Number),
            rubroContable: expense.accounting_item,
            task_id: expense.task_id,
            activity_id: expense.activity_id,
            id: expense.id
        }));
    }

    calcularTotal(meses: number[]): number {
        return meses.reduce((acc, mes) => acc + mes, 0);
    }

    totalMeses(): number[] {
        const mesesTotales = Array(12).fill(0);
        this.gastosIngresados.forEach(gasto => {
            gasto.meses.forEach((monto: number, index: number) => {
                mesesTotales[index] += monto;
            });
        });
        return mesesTotales;
    }

    calcularTotalTotal(): number {
        return this.totalMeses().reduce((acc, mes) => acc + mes, 0);
    }

    backList() {
        this.calGetBudgetList();
        this.budgetSelected = null;
    }

    showEdition() {
        this.edition = true;
        this.callGetListActivitybyPlan(this.budgetSelected.plan_id);
    }

    cancelEdition() {
        this.edition = false;
        this.tasks = null;
        this.activities = null;
        this.completedTaskIds = null;
        this.activitySelected = null;
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

    setTasksAsCompleted(): void {
        this.tasks.forEach(task => {
            if (this.completedTaskIds.includes(task.id)) {
                task.done = true;
            }
        });

        console.log('this.tasks', this.tasks)
    }

    taskSelection(task: any): void {
        this.tasks.forEach(a => a.selected = false);
        task.selected = true;
        this.taskSelected = task;
        console.log(task)
    }

    deleteGasto(gasto: any): void {
        console.log('gasto', gasto)
        console.log('this.gastosIngresados', this.gastosIngresados)
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

    clearTaskSelection(): void {
        this.tasks.forEach(task => task.selected = false);
        this.taskSelected = null;
    }

    extractTaskIdsByDoneTasks(data: any[]) {
        this.completedTaskIds = data.map(item => item.task_id);
    }

    agregarGasto() {
        if (!this.taskSelected) {
            alert("Por favor, selecciona una tarea antes de agregar un gasto.");
            return;
        }
        this.markTaskAsDone();
        console.log('this.activitySelected.code_activity', this.activitySelected.code_activity)
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

        this.gastosIngresados.push(newGasto);
        console.log('this.gastosIngresados', this.gastosIngresados);

        this.gastoForm.reset();
        this.gastoForm.setControl('meses', this.fb.array(Array(12).fill(0)));
        this.taskSelected = null;
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

    saveEdition() {
        this.loaderServide.show(true);
        const request = this.generateRequest(this.gastosIngresados);
        this.service.putBudgetUpdate(this.budgetSelected.id, request).pipe().
            subscribe((res: any) => {
                if (res.status) {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: 'Los datos han sido actualizados.',
                        life: 3000,
                      });
                      this.edition = false;
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

    generateRequest(data: any[]): any[] {
        const planId = this.budgetSelected.plan_id;

        const transformedData = {
            plan_id: planId,
            expenses: data.map(item => ({
                id: item.id,
                activity_id: item.activity_id,
                task_id: item.task_id,
                accounting_item: item.rubroContable,
                specific_expense: item.gastoEspecifico,
                month_amount: item.meses.join(",")
            }))
        };

        return [transformedData];
    }


}