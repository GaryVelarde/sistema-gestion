import {
    Component,
    ViewChild,
    OnInit,
    AfterViewInit,
    ChangeDetectorRef,
    ElementRef,
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
import { DateFormatService } from 'src/app/services/date-format.service';
import { PrimeNGConfig } from 'primeng/api';
interface Task {
    id: number;
    title: string;
    description: string;
    dateEnd: string;
}
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
}
@Component({
    selector: 'app-events',
    templateUrl: './events-udi.component.html',
    styleUrls: ['./events-udi.component.scss'],
})
export class EventsUdiComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('cardBody') cardBody!: ElementRef;
    resizeObserver!: ResizeObserver;

    pendingTasks: Task[];
    inProgressTasks: Task[];
    completedTasks: Task[];
    draggedTask: Task | null = null;
    showEventDetail = false;
    newEventDialog = false;
    newTaskDialog = false;
    taskSelectedId: number;
    timeslots = [
        { name: '10 minutos', code: '00:10:00' },
        { name: '15 minutos', code: '00:15:00' },
        { name: '20 minutos', code: '00:20:00' },
        { name: '30 minutos', code: '00:30:00' },
    ];

    comments = [
        {
            name: 'John Doe',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            isComment: true,
        },
        {
            name: 'Alice Smith',
            content:
                'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            isComment: true,
        },
    ];

    data = [
        {
            "id": 97,
            "title": "Reunión UDI 6",
            "description": "Descripción de la Reunión de UDI",
            "start_date": "14/07/2024 15:05",
            "due_date": "15/07/2024 15:05",
            "color": "#fff544",
            "status": "En Progreso",
            "meeting_url": "https://testaa.com",
            "created_at": "25/07/2024 20:25:59",
            "managers": [
                {
                    "id": 5,
                    "name": "Ana",
                    "surnames": "Benavidez Ayala",
                    "code": 15467824,
                    "email": "manuel@test.com",
                    "phone": 987145312,
                    "orcid": null,
                    "cip": null
                }
            ],
            "participants": [
                {
                    "id": 2,
                    "name": "Ana",
                    "surnames": "Benavidez Ayala",
                    "code": 15467824,
                    "email": "ana@test.com",
                    "phone": 987145312,
                    "orcid": null,
                    "cip": null
                },
                {
                    "id": 3,
                    "name": "Ana",
                    "surnames": "Benavidez Ayala",
                    "code": 15467824,
                    "email": "jose@test.com",
                    "phone": 987145312,
                    "orcid": null,
                    "cip": null
                },
                {
                    "id": 6,
                    "name": "Ana",
                    "surnames": "Benavidez Ayala",
                    "code": 15467824,
                    "email": "manuels@test.com",
                    "phone": 987145312,
                    "orcid": null,
                    "cip": null
                },
                {
                    "id": 7,
                    "name": "Ana",
                    "surnames": "Benavidez Ayala",
                    "code": 15467824,
                    "email": "maaaanuels@test.com",
                    "phone": 987145312,
                    "orcid": null,
                    "cip": null
                }
            ]
        }
    ]

    // Define el arreglo de eventos
    events: EventInput[] = [
        {
            title: 'Evento 1',
            start: '2024-08-23T14:20:00',
            end: '2024-08-23T15:20:00',
            backgroundColor: '#FF5733', // Color de fondo del evento
            borderColor: '#FF5733', // Color del borde del evento (opcional)
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
        {
            title: 'Evento 2',
            start: '2024-08-23T14:20:00',
            end: '2024-08-23T15:20:00',
            backgroundColor: '#337DFF',
            borderColor: '#337DFF',
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
    ];

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
        slotLabelFormat: {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true // Esto establece el formato de 12 horas con AM/PM
        }

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

    eventSelected: any;

    public eventForm: FormGroup;
    public slotDurationForm: FormGroup;
    public taskForm: FormGroup;
    public managerForm: FormGroup;
    public participantsForm: FormGroup;
    public commentsForm: FormGroup;
    private _slotDuration: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _title: FormControl = new FormControl('', [Validators.required]);
    private _description: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _eventLink: FormControl = new FormControl('');
    private _titleTask: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _start: FormControl = new FormControl('', [Validators.required]);
    private _end: FormControl = new FormControl('', [Validators.required]);
    private _endTask: FormControl = new FormControl('', [Validators.required]);
    private _assignedUser: FormControl = new FormControl([] as Usuario[], [Validators.required]);
    private _descriptionTask: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _color: FormControl = new FormControl('#ff0000', [
        Validators.required,
    ]);
    private _usersManager: FormControl = new FormControl([] as Usuario[], [
        Validators.required,
    ]);
    private _usersParticipants: FormControl = new FormControl([] as Usuario[], [
        Validators.required,
    ]);
    private _comment: FormControl = new FormControl('', [Validators.required]);

    get slotDuration() {
        return this._slotDuration;
    }
    get title() {
        return this._title;
    }
    get eventLink() {
        return this._eventLink;
    }
    get description() {
        return this._description;
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
    get usersManager() {
        return this._usersManager;
    }
    get usersParticipants() {
        return this._usersParticipants;
    }
    get assignedUser() {
        return this._assignedUser;
    }
    get comment() {
        return this._comment;
    }

    get reversedComments() {
        return this.comments.slice().reverse();
    }
    selectedItems: Usuario[] | undefined;

    usuarios: Usuario[] = [
        { id: 1, nombre: 'Ana', apellidos: 'Benavidez Ayala' },
        { id: 2, nombre: 'Gary', apellidos: 'Gomez Bazalar' },
        { id: 3, nombre: 'María', apellidos: 'Villanueva Alarcón' },
        { id: 4, nombre: 'Carlos', apellidos: 'Ramirez Perez' },
        { id: 5, nombre: 'Luis', apellidos: 'Lopez Fernandez' },
        // Agrega más usuarios según sea necesario
    ];
    filteredItems: Usuario[] | undefined;

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dateFormatService: DateFormatService,
        private config: PrimeNGConfig,
    ) {
        this.slotDurationForm = this.fb.group({
            slotDuration: this.slotDuration,
        });
        this.eventForm = this.fb.group({
            title: this.title,
            description: this.description,
            eventLink: this.eventLink,
            start: this.start,
            end: this.end,
            color: this.color,
        });
        this.taskForm = this.fb.group({
            titleTask: this.titleTask,
            descriptionTask: this.descriptionTask,
            endTask: this.endTask,
            assignedUser: this.assignedUser,
        });
        this.managerForm = this.fb.group({
            usersManager: this.usersManager,
        });
        this.participantsForm = this.fb.group({
            usersParticipants: this.usersParticipants,
        });
        this.commentsForm = this.fb.group({
            comment: this.comment,
        });
        this.pendingTasks = [
            {
                id: 1,
                title: 'Tarea 1',
                description: 'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
                dateEnd: '26-07-2024'
            },
            {
                id: 2,
                title: 'Tarea 2',
                description: 'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
                dateEnd: '23-07-2024'
            }
        ];

        this.inProgressTasks = [
            {
                id: 3,
                title: 'Tarea 3',
                description: 'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
                dateEnd: '23-07-2024'
            },
            {
                id: 4,
                title: 'Tarea 4',
                description: 'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
                dateEnd: '23-07-2024'
            },
            {
                id: 5,
                title: 'Tarea 5',
                description: 'Esta es una tarea de prueba, bla bla bla bla bla bla bla bla',
                dateEnd: '23-07-2024'
            }
        ];

        this.completedTasks = [

        ];
    }

    ngOnInit() {
        this.watchUsersManager();
        this.slotDuration.setValue(this.timeslots[this.timeslots.length - 1]);
        this.watchSlotDuration();
        this.color.setValue('#ff0000');
        this.config.setTranslation({
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
            monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
            today: 'Hoy',
            clear: 'Borrar',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Sm'
        });
    }

    ngAfterViewInit(): void {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                this.renderizeCalendar();
            }
        });
        if (this.cardBody && this.cardBody.nativeElement) {
            this.resizeObserver.observe(this.cardBody.nativeElement);
        }
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
        this.managerForm.reset();
        this.participantsForm.reset();
        const dateInfo = this.dateFormatService.formatDateWithEndTime(arg.dateStr);
        if (dateInfo.start === "00:00") {
            dateInfo.start = "07:00 AM"
            dateInfo.end = "08:00 AM"
        }
        this.start.setValue(dateInfo.day + ' ' + dateInfo.start);
        this.end.setValue(dateInfo.day + ' ' + dateInfo.end);
        this.color.setValue('#ff0000');
        this.newEventDialog = true;
    }

    handleEventClick(arg) {
        this.eventSelected = arg;
        console.log('eventSelected', this.eventSelected);
        this.showEventDetail = true;
    }

    renderizeCalendar() {
        this.calendarComponent.getApi().render();
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
                start: this.dateFormatService.formatDateToISO(this.start.value),
                end: this.dateFormatService.formatDateToISO(this.end.value),
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
            this.newEventDialog = false;
        }
    }

    dragStart(task: Task) {
        this.draggedTask = task;
    }

    drop(event: any, column: 'pending' | 'inProgress' | 'completed') {
        if (this.draggedTask) {
            const columnBefore = this.isTaskInPending(this.draggedTask.id);
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

    showNewTaskDialog() {
        this.taskForm.reset();
        this.newTaskDialog = true;
        this.taskSelectedId = 0;
    }

    deleteTask(task: Task) {
        this.removeTask(task);
    }

    editTask(task: Task) {
        this.taskForm.reset();
        this.titleTask.setValue(task.title);
        this.descriptionTask.setValue(task.description);
        this.endTask.setValue(this.dateFormatService.formatDateDDMMYYYY(task.dateEnd));
        this.taskSelectedId = task.id;
        this.newTaskDialog = true;
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

    addTask(id: number) {
        if (id > 0) {
            const taskIndex = this.pendingTasks.findIndex(task => task.id === id);
            const updateTask: Task = {
                id: this.getMaxId() + 1,
                title: this.titleTask.value,
                description: this.descriptionTask.value,
                dateEnd: this.dateFormatService.formatDateDDMMYYYY(this.endTask.value)
            };
            if (taskIndex !== -1) {
                this.pendingTasks[taskIndex] = { ...this.pendingTasks[taskIndex], ...updateTask };
            } else {
                console.error(`Task with id ${id} not found.`);
            }
            this.newTaskDialog = false;
            this.taskForm.reset();
            return;
        }
        const newTask: Task = {
            id: this.getMaxId() + 1,
            title: this.titleTask.value,
            description: this.descriptionTask.value,
            dateEnd: this.dateFormatService.formatDateDDMMYYYY(this.endTask.value)
        };
        if (!this.isTaskInPending(this.getMaxId() + 1)) {
            this.pendingTasks = [...this.pendingTasks, newTask];
            this.newTaskDialog = false;
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

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredItems = this.usuarios
            .filter(
                (usuario) =>
                    usuario.nombre.toLowerCase().includes(query) ||
                    usuario.apellidos.toLowerCase().includes(query)
            )
            .map((usuario) => ({
                ...usuario,
                fullName: `${usuario.nombre} ${usuario.apellidos}`,
            }));
    }

    watchUsersManager(): void {
        this.usersManager.valueChanges.pipe().subscribe((value) => {
            console.log(value);
        });
    }

    addComment(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (this.comment.value) {
                this.comments.push({
                    name: 'Gary Velarde',
                    content: this.comment.value,
                    isComment: true,
                });
                this.comment.setValue('');
                this.comment.reset();
            }
        }
    }

    formatText(text: string): string {
        return text.replace(/\n/g, '<br>');
    }

    getFirstLetter(str: string): string {
        if (!str) {
            console.error('The string is empty');
            return '';
        }
        const firstLetter = str.charAt(0);
        const firstLetterUpper = firstLetter.toUpperCase();
        return firstLetterUpper;
    }
}
