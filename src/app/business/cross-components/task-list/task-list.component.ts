import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [TaskService]
})
export class TaskListComponent implements OnInit, OnDestroy {
  _visible: boolean;
  _chbDisable: boolean
  @Input() module: eModule;
  @Input() idModule: string;
  @Input()
  set visible(value: boolean) {
    this._visible = value;
  }
  @Input()
  set chbDisable(value: boolean) {
    this._chbDisable = value;
  }
  private destroy$ = new Subject<void>();
  skeletonRows = ['1', '2', '2', '4'];
  tasks: any[] = []
  statusCallService = '';
  statusRegister = '';
  messages: Message[] = [
    { severity: 'info', detail: 'Una vez que marques una tarea como completada, no podrás desmarcarla. Por favor, asegúrate de que la tarea está realmente finalizada antes de marcarla.' },
  ];
  messageError: string = 'Lo sentimos, ha ocurrido un problema al intentar cargar la lista de tareas. Por favor, intente nuevamente más tarde. Si el problema persiste, contacte al soporte técnico.';
  tasksForm: FormGroup;
  private _taskDescription: FormControl = new FormControl('', [
    Validators.required,
  ]);

  get taskDescription() {
    return this._taskDescription;
  }
  totalTask = 0;
  totalTaskIncomplete = 0;
  totalTaskComplete = 0;
  constructor(
    private fb: FormBuilder,
    private elRef: ElementRef,
    private service: AuthService,
    private taskService: TaskService,
  ) {
    this.tasksForm = this.fb.group({
      taskDescription: this.taskDescription,
    });
  }

  ngOnInit() {
    this.callTaskList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callGetAdvisoryTaskList() {
    this.statusCallService = 'charging';
    this.service.getAdvisoryTasks(this.idModule).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.data) {
        this.statusCallService = 'complete';
        this.tasks = res.data;
        this.countTask();
      }
    }, (error) => {
      this.statusCallService = 'error';
    });
  }

  callGetInscriptionTaskList() {
    this.statusCallService = 'charging';
    this.service.getInscriptionTasks(this.idModule).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.data) {
        this.statusCallService = 'complete';
        this.tasks = res.data;
        this.countTask();
      }
    }, (error) => {
      this.statusCallService = 'error';
    });
  }

  addTask(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log(this.taskDescription.value); // Asegúrate de que esto no sea null
      if (this.taskDescription.value) {
        this.statusRegister = 'charging';
        const rq = {
          description: this.taskDescription.value
        }
        this.registerTask(rq);
      }
    }
  }

  registerTask(rq: any) {
    switch (this.module) {
      case eModule.advisory:
        this.service.postAddAdvisoryTask(this.idModule, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.statusRegister = 'complete';
              this.confirmRegister(res.id);
            }
            console.log(res);
          }, (error) => {
            this.statusRegister = 'complete';
          })
        break;
      case eModule.eventUdi:
        break;
      case eModule.inscription:
        this.service.postAddInscriptionTask(this.idModule, rq).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            if (res.status) {
              this.statusRegister = 'complete';
              this.confirmRegister(res.id);
            }
            console.log(res);
          }, (error) => {
            this.statusRegister = 'complete';
          })
        break;
    }
  }

  confirmRegister(id: string) {
    this.tasks.unshift({
      id: id,
      description: this.taskDescription.value,
      checked: false,
    });
    this.taskDescription.reset();
    this.countTask();
  }

  taskDone(inputId: string, checkbox: any): void {
    if (!this._chbDisable) {
      const labelElement = this.elRef.nativeElement.querySelector(
        `label[for="${inputId}"]`
      );
      if (labelElement) {
        labelElement.classList.add('task-done');
      }
      if (checkbox) {
        checkbox.disabled = true;
      }
      this.countTask();
    }

  }

  isTaskDone(task: any): any {
    return {
      'task-done': task.checked,
    };
  }

  removeTask(taskId: string) {
    switch (this.module) {
      case eModule.advisory:
        this.callDeleteAdvisoryTask(taskId);
        break;
      case eModule.inscription:
        this.callDeleteInscriptionTask(taskId);
        break;
      case eModule.eventUdi:
        this.callDeleteEventUdiTask(taskId);
        break;
    }
  }

  confirmRemoveTask(taskId: string) {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
    this.countTask();
  }

  countTask(): void {
    this.totalTask = 0;
    this.totalTaskIncomplete = 0;
    this.totalTaskComplete = 0;
    this.tasks.forEach((task) => {
      if (task.checked) {
        this.totalTaskComplete++;
      } else {
        this.totalTaskIncomplete++;
      }
      this.totalTask++;
    });
  }

  callTaskList() {
    switch (this.module) {
      case eModule.advisory:
        this.callGetAdvisoryTaskList();
        break;
      case eModule.inscription:
        this.callGetInscriptionTaskList();
        break;
      case eModule.eventUdi:
        this.callGetAdvisoryTaskList();
        break;
    }
  }

  handleReload(event: boolean) {
    if (event) {
      this.callTaskList();
    }
  }

  callDeleteAdvisoryTask(taskId: string) {
    this.taskService.deleteAdvisoryTask(this.idModule, taskId).pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveTask(taskId);
          }
        }, (error) => {

        })
  }

  callDeleteArticleTask(taskId: string) {
    this.taskService.deleteArticleTask(this.idModule, taskId).pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveTask(taskId);
          }
        }, (error) => {

        })
  }

  callDeleteEventUdiTask(taskId: string) {
    this.taskService.deleteEventUdiTask(this.idModule, taskId).pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveTask(taskId);
          }
        }, (error) => {

        })
  }

  callDeleteInscriptionTask(taskId: string) {
    this.taskService.deleteInscriptionTask(this.idModule, taskId).pipe(takeUntil(this.destroy$)).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveTask(taskId);
          }
        }, (error) => {

        })
  }
}
