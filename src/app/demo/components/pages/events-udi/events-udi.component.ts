import {
    Component,
    ViewChild,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
} from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
interface Task {
    id: number;
    title: string;
    description: string;
}
@Component({
    selector: 'app-events',
    templateUrl: './events-udi.component.html',
    styleUrls: ['./events-udi.component.scss'],
})
export class EventsUdiComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;

    pendingTasks: Task[];
    inProgressTasks: Task[];
    completedTasks: Task[];
    draggedTask: Task | null = null;
    addNewTaskDialog = false;
    showEventDetail = false;
    timeslots = [
        { name: '10 minutos', code: '00:10:00' },
        { name: '15 minutos', code: '00:15:00' },
        { name: '20 minutos', code: '00:20:00' },
        { name: '30 minutos', code: '00:30:00' },
    ];

    // Define el arreglo de eventos
    events: EventInput[] = [
        {
            title: 'Evento 1',
            start: new Date(),
            backgroundColor: '#FF5733', // Color de fondo del evento
            borderColor: '#FF5733', // Color del borde del evento (opcional)
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
        {
            title: 'Evento 2',
            start: new Date(),
            backgroundColor: '#337DFF',
            borderColor: '#337DFF',
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
    ];

    // Formulario reactivo
    eventForm: FormGroup;
    displayDialog: boolean = false;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista',
        },
        locale: esLocale,
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.handleEventClick.bind(this),
        editable: true,
        selectable: true,
        eventResizableFromStart: true,
        events: this.events,
        eventDrop: this.handleEventDrop.bind(this),
        eventResize: this.handleEventResize.bind(this),
        slotDuration: '00:30:00',
        slotLabelInterval: '00:30',
    };

    users: any[] = [
        {
            id: 0,
            name: 'Amy Elsner',
            image: 'amyelsner.png',
            role: 'Encargado',
        },
        { id: 1, name: 'Anna Fali', image: 'annafali.png', role: 'Miembro' },
        {
            id: 2,
            name: 'Asiya Javayant',
            image: 'asiyajavayant.png',
            role: 'Miembro',
        },
        {
            id: 3,
            name: 'Bernardo Dominic',
            image: 'bernardodominic.png',
            role: 'Miembro',
        },
        {
            id: 4,
            name: 'Elwin Sharvill',
            image: 'elwinsharvill.png',
            role: 'Miembro',
        },
    ];

    items: any[] | undefined;

    eventSelected: any;

    public slotDurationForm: FormGroup;
    public taskForm: FormGroup;
    private _slotDuration: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _title: FormControl = new FormControl('', [Validators.required]);
    private _titleTask: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _start: FormControl = new FormControl('', [Validators.required]);
    private _end: FormControl = new FormControl('', [Validators.required]);
    private _endTask: FormControl = new FormControl('', [Validators.required]);
    private _descriptionTask: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _color: FormControl = new FormControl('#ff0000', [
        Validators.required,
    ]);

    get slotDuration() {
        return this._slotDuration;
    }
    get title() {
        return this._title;
    }
    get titleTask() {
        return this._titleTask;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get endTask() {
        return this._endTask;
    }
    get color() {
        return this._color;
    }
    get descriptionTask() {
        return this._descriptionTask;
    }

    constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
        this.slotDurationForm = this.fb.group({
            slotDuration: this.slotDuration,
        });
        this.eventForm = this.fb.group({
            title: this.title,
            start: this.start,
            end: this.end,
            color: this.color,
        });
        this.taskForm = this.fb.group({
            titleTask: this.titleTask,
            descriptionTask: this.descriptionTask,
            endTask: this.endTask,
        });
        this.pendingTasks = [
            {
                id: 1,
                title: 'Tarea 1',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 2,
                title: 'Tarea 2',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 3,
                title: 'Tarea 3',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 4,
                title: 'Tarea 4',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 5,
                title: 'Tarea 5',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 6,
                title: 'Tarea 6',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
            {
                id: 7,
                title: 'Tarea 7',
                description:
                    'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
            },
        ];
        this.inProgressTasks = [];
        this.completedTasks = [];
    }

    ngOnInit() {
        this.slotDuration.setValue(this.timeslots[this.timeslots.length - 1]);
        this.watchSlotDuration();
        this.color.setValue('#ff0000');
    }

    ngAfterViewInit(): void {
        this.addButtonToToolbarChunk();
    }

    getBadge(user) {
        if (user.role === 'Miembro') return 'info';
        else if (user.role === 'Encargado') return 'warning';
        else return null;
    }

    backCalendar() {
        this.showEventDetail = false;
    }

    watchSlotDuration() {
        this.slotDuration.valueChanges.pipe().subscribe((value) => {
            if (value.code.length) {
                this.updateCalendarOptions(
                    value.code,
                    value.code.substring(0, 5)
                );
            }
        });
    }
    updateCalendarOptions(duration: string, interval: string) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.setOption('slotDuration', duration);
        calendarApi.setOption('slotLabelInterval', interval);
    }

    handleDateClick(arg) {
        this.eventForm.reset();
        this.start.setValue(arg.date);
        this.end.setValue(arg.date);
        this.color.setValue('#ff0000');
        this.displayDialog = true;
    }

    handleEventClick(arg) {
        this.eventSelected = arg;
        console.log('eventSelected', this.eventSelected);
        this.showEventDetail = true;
    }

    renderizeCalendar() {
        this.calendarComponent.getApi().render();
    }

    addButtonToToolbarChunk() {
        const headerToolbars = document.querySelectorAll('.fc-header-toolbar');
        if (headerToolbars.length >= 1) {
            const secondHeaderToolbar = headerToolbars[0];
            if (secondHeaderToolbar) {
                const toolbarChunk =
                    secondHeaderToolbar.querySelector('.fc-toolbar-chunk');
                if (toolbarChunk) {
                    const newButton = document.createElement('button');
                    newButton.innerText = 'Recargar calendario';
                    newButton.className =
                        'fc-today-button fc-button fc-button-primary';
                    newButton.addEventListener('click', () =>
                        this.renderizeCalendar()
                    );
                    toolbarChunk.appendChild(newButton);
                }
            }
        }
    }

    handleEventDrop(eventDropInfo) {
        alert('Event dropped to ' + eventDropInfo.event.start);
    }

    handleEventResize(eventResizeInfo) {
        alert('Event resized to ' + eventResizeInfo.event.end);
    }

    addEvent() {
        if (this.eventForm.valid) {
            const newEvent: EventInput = {
                title: this.title.value,
                start: this.start.value,
                end: this.end.value,
                allDay: false,
                editable: true,
                startResizable: true,
                durationEditable: true,
                backgroundColor: this.color.value,
                borderColor: this.color.value,
            };
            this.events.push(newEvent);
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.addEvent(newEvent);
            this.displayDialog = false;
        }
    }

    dragStart(task: Task) {
        this.draggedTask = task;
    }

    drop(event: any, column: 'pending' | 'inProgress' | 'completed') {
        console.log('column', column);
        if (this.draggedTask) {
            const columnBefore = this.isTaskInPending(this.draggedTask.id);
            console.log('column before', columnBefore);
            if (
                (columnBefore === 'inProgress' && column === 'pending') ||
                (columnBefore === 'completed' && column === 'pending') ||
                (columnBefore === 'completed' && column === 'inProgress')
            ) {
                return;
            }
            this.removeTask(this.draggedTask);
            if (column === 'pending') {
                this.pendingTasks = [...this.pendingTasks, this.draggedTask];
            } else if (column === 'inProgress') {
                this.inProgressTasks = [
                    ...this.inProgressTasks,
                    this.draggedTask,
                ];
            } else if (column === 'completed') {
                this.completedTasks = [
                    ...this.completedTasks,
                    this.draggedTask,
                ];
            }
            this.draggedTask = null;
            this.cdr.detectChanges();
        }
    }

    dragEnd() {
        this.draggedTask = null;
    }

    removeTask(task: Task) {
        this.pendingTasks = this.pendingTasks.filter((t) => t.id !== task.id);
        this.inProgressTasks = this.inProgressTasks.filter(
            (t) => t.id !== task.id
        );
        this.completedTasks = this.completedTasks.filter(
            (t) => t.id !== task.id
        );
    }

    deleteTask(task: Task) {
        this.removeTask(task);
    }

    isTaskInPending(id: number): string {
        let column = '';
        if (this.pendingTasks.find((task) => task.id === id)) {
            column = 'pending';
        }
        if (this.inProgressTasks.find((task) => task.id === id)) {
            column = 'inProgress';
        }
        if (this.completedTasks.find((task) => task.id === id)) {
            column = 'completed';
        }
        return column;
    }

    addTask() {
        const newTask: Task = {
            id: this.getMaxId() + 1,
            title: this.titleTask.value,
            description: this.descriptionTask.value,
        };
        if (!this.isTaskInPending(this.getMaxId() + 1)) {
            this.pendingTasks = [...this.pendingTasks, newTask];
            this.addNewTaskDialog = false;
            this.taskForm.reset();
        } else {
            console.log('Task with this ID already exists.');
        }
    }

    getMaxId(): number | null {
        const allTasks = [
            ...this.pendingTasks,
            ...this.inProgressTasks,
            ...this.completedTasks,
        ];
        if (allTasks.length === 0) {
            return null;
        }
        const maxId = Math.max(...allTasks.map((task) => task.id));
        return maxId;
    }
}
