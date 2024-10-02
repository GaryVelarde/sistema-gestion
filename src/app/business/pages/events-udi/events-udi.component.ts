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
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
interface Task {
    id: string;
    title: string;
    description: string;
    dateEnd: string;
    user: {
        id: string,
        name: string,
        surnames: string,
        code: number,
        email: string,
        phone: number,
        orcid: string,
        cip: number,
    };
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

    pendingTasks: Task[] = [];
    inProgressTasks: Task[] = [];
    completedTasks: Task[] = [];
    draggedTask: Task | null = null;
    showEventDetail = false;
    newEventDialog = false;
    newTaskDialog = false;
    taskSelectedId: string;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Eventos' },
        { label: 'Reuniones UDI', visible: true },
    ];
    detailsBreadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Eventos' },
        { label: 'Reuniones UDI' },
        { label: 'Detalle de la reunión', visible: true },
    ];
    timeslots = [
        { name: '10 minutos', code: '00:10:00' },
        { name: '15 minutos', code: '00:15:00' },
        { name: '20 minutos', code: '00:20:00' },
        { name: '30 minutos', code: '00:30:00' },
    ];

    rowsSkeletonTask = ['1', '2', '3'];
    statusTask = 'charging';
    data = [
        {
            "id": 1,
            "title": "Reunión UDI 6",
            "description": "Descripción de la Reunión de UDI",
            "start_date": "14/09/2024 15:05",
            "due_date": "15/09/2024 15:05",
            "color": "#fff544",
            "status": "En Progreso",
            "meeting_url": "https://primeng.org/icons",
            "created_at": "25/07/2024 20:25:59",
            "managers": [
                {
                    "id": 2,
                    "name": "Lic. Ornela Bravo",
                    "surnames": "Tijerina",
                    "code": 12590671,
                    "email": "lgamboa@example.net",
                    "phone": 612512384,
                    "orcid": "inventore",
                    "cip": 79581284
                }
            ],
            "participants": [
                {
                    "id": 9,
                    "name": "Axel Lira Manzanares",
                    "surnames": "Preciado",
                    "code": 56550234,
                    "email": "peres.regina@example.org",
                    "phone": 608053584,
                    "orcid": "occaecati",
                    "cip": 25255441
                },
                {
                    "id": 8,
                    "name": "Emilia Delfina Macías Serna",
                    "surnames": "Ortega",
                    "code": 14149080,
                    "email": "quinonez.cristobal@example.com",
                    "phone": 721170880,
                    "orcid": "et",
                    "cip": 35852992
                }
            ]
        }
    ]

    // Define el arreglo de eventos
    events: EventInput[] = [
        {
            title: 'Reunión de profesores',
            start: '2024-08-23T14:30:00',
            end: '2024-08-23T15:20:00',
            backgroundColor: '#FF5733', // Color de fondo del evento
            borderColor: '#FF5733', // Color del borde del evento (opcional)
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
        {
            title: 'Evento 2',
            start: '2024-08-23T14:30:00',
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
    teacherL = userType.teacher;
    eventSelected: any;
    module = eModule.eventUdi;
    public eventForm: FormGroup;
    public slotDurationForm: FormGroup;
    public taskForm: FormGroup;
    public managerForm: FormGroup;
    public participantsForm: FormGroup;
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
    private _assignedUser: FormControl = new FormControl({}, [Validators.required]);
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
    selectedItems: Usuario[] | undefined;

    usuarios: any[] = [];

    filteredItems: Usuario[] | undefined;

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dateFormatService: DateFormatService,
        private config: PrimeNGConfig,
        private service: AuthService,
        private loaderService: LoaderService,
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
    }

    ngOnInit() {
        this.callGetEventsUdi();
        this.watchUsersManager();
        this.getTeachersList();
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
        this.watchassignedUser()
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

    async callGetEventsUdi() {
        await this.service.getEventsUdiList().pipe().subscribe(
            (res: any) => {
                for (let event of res.data) {
                    const ev: EventInput = {
                        title: event.title,
                        start: this.dateFormatService.formatDateCalendar(event.start_date),
                        end: this.dateFormatService.formatDateCalendar(event.due_date),
                        backgroundColor: event.color,
                        borderColor: event.color,
                        editable: true,
                        startResizable: true,
                        durationEditable: true,
                        event_udi: event
                    }
                    this.events = [...this.events, ev];
                }
                this.calendarOptions = {
                    ...this.calendarOptions,
                    events: this.events
                };

            })
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
        this.loaderService.show();
        this.eventSelected = arg;
        const usersManager: Usuario[] = [];
        const usersParticipants: Usuario[] = [];
        for (let user of this.eventSelected.event._def.extendedProps.event_udi.managers) {
            const userArr = {
                id: user.id,
                nombre: user.name,
                apellidos: user.surnames,
                fullName: user.name + ' ' + user.surnames
            }
            usersManager.push(userArr);
        }
        for (let user of this.eventSelected.event._def.extendedProps.event_udi.participants) {
            const userArr = {
                id: user.id,
                nombre: user.name,
                apellidos: user.surnames,
                fullName: user.name + ' ' + user.surnames
            }
            usersParticipants.push(userArr);
        }
        this.usersManager.setValue(usersManager);
        this.usersParticipants.setValue(usersParticipants);
        this.getTask(this.eventSelected.event._def.extendedProps.event_udi.id);
        this.showEventDetail = true;
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    backCalendar() {
        this.loaderService.show();
        this.showEventDetail = false;
        this.eventSelected = null;
        this.usersManager.setValue([]);
        this.usersParticipants.setValue([]);
        setTimeout(() => {
            this.loaderService.hide();
        }, 800);
    }

    renderizeCalendar() {
        this.calendarComponent.getApi().render();
    }

    handleEventDrop(eventDropInfo) {
    }

    handleEventResize(eventResizeInfo) {
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
                columnBefore === column
            ) {
                return;
            }
            this.statusTask = 'charging';
            const task = this.draggedTask;
            const taskId = this.draggedTask.id;
            this.service.updateStatusTask(this.eventSelected.event._def.extendedProps.event_udi.id,
                taskId.toString(), column).pipe().subscribe(
                    (res: any) => {
                        if (res.status) {
                            this.removeTask(task);
                            if (column === 'pending') {
                                this.pendingTasks = [...this.pendingTasks, task];
                            } else if (column === 'inProgress') {
                                this.inProgressTasks = [
                                    ...this.inProgressTasks,
                                    task,
                                ];
                            } else if (column === 'completed') {
                                this.completedTasks = [
                                    ...this.completedTasks,
                                    task,
                                ];
                            }
                            this.draggedTask = null;
                            this.cdr.detectChanges();
                            this.statusTask = 'complete';
                        }
                    }, (error) => {
                        this.statusTask = 'error';
                    })

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
        this.taskSelectedId = '';
    }

    deleteTask(task: Task) {
        this.statusTask = 'charging';
        this.service.deleteTask(this.eventSelected.event._def.extendedProps.event_udi.id,
            task.id.toString()
        ).pipe().subscribe(
            (res: any) => {
                if (res.status) {
                    this.removeTask(task);
                    this.statusTask = 'complete';

                }
            }, (error) => {
                this.statusTask = 'error';
            })
    }

    editTask(task: any) {
        console.log(task)
        this.taskForm.reset();
        this.titleTask.setValue(task.title);
        this.descriptionTask.setValue(task.description);
        this.endTask.setValue(this.dateFormatService.formatDateDDMMYYYY(task.dateEnd));
        const user = task.user;
        user.fullName = task.user.name + ' ' + task.user.surnames;
        this.assignedUser.setValue(user);
        this.taskSelectedId = task.id;
        this.newTaskDialog = true;
    }

    isTaskInPending(id: string): string {
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

    addTask(id: string) {
        this.statusTask = 'charging';
        const request = {
            "title": this.titleTask.value,
            "description": this.descriptionTask.value,
            "commitment_date": this.dateFormatService.formatDateDDMMYYYY(this.endTask.value),
            "user_id": this.assignedUser.value.id
        }
        if (id) {
            this.service.updateTaskDetail(this.eventSelected.event._def.extendedProps.event_udi.id, id.toString(), request).pipe()
                .subscribe((res: any) => {
                    if (res) {
                        const taskIndex = this.pendingTasks.findIndex(task => task.id === id);
                        const updateTask: Task = {
                            id: res.id,
                            title: this.titleTask.value,
                            description: this.descriptionTask.value,
                            dateEnd: this.dateFormatService.formatDateDDMMYYYY(this.endTask.value),
                            user: this.assignedUser.value[0]
                        };
                        if (taskIndex !== -1) {
                            this.pendingTasks[taskIndex] = { ...this.pendingTasks[taskIndex], ...updateTask };
                        } else {
                            console.error(`Task with id ${id} not found.`);
                        }
                        this.newTaskDialog = false;
                        this.taskForm.reset();
                        this.statusTask = 'complete';
                        return;
                    }
                }, (error) => {
                    this.statusTask = 'error';
                })

        }
        this.service.addTask(this.eventSelected.event._def.extendedProps.event_udi.id, request).pipe()
            .subscribe(
                (res: any) => {
                    if (res.status) {
                        const newTask: Task = {
                            id: res.id_task,
                            title: this.titleTask.value,
                            description: this.descriptionTask.value,
                            dateEnd: this.dateFormatService.formatDateDDMMYYYY(this.endTask.value),
                            user: this.assignedUser.value[0]
                            //user_name: this.assignedUser.value.fullName
                        };
                        if (!this.isTaskInPending(res.id)) {
                            this.pendingTasks = [...this.pendingTasks, newTask];
                            this.newTaskDialog = false;
                            this.taskForm.reset();
                        } else {
                            console.log('Task with this ID already exists.');
                        }
                        this.statusTask = 'complete';

                    }
                }, (error) => {
                    this.statusTask = 'error';
                })

    }

    watchassignedUser() {
        this.assignedUser.valueChanges.subscribe(
            (res) => {
                console.log('valueChanges', res)
            })
    }

    search(event: AutoCompleteCompleteEvent) {
        const query = event.query.toLowerCase();
        this.filteredItems = this.usuarios
            .filter(
                (usuario) =>
                    usuario.name.toLowerCase().includes(query) ||
                    usuario.surnames.toLowerCase().includes(query)
            )
            .map((usuario) => ({
                ...usuario,
                fullName: `${usuario.name} ${usuario.surnames}`,
            }));
    }

    watchUsersManager(): void {
        this.usersManager.valueChanges.pipe().subscribe((value) => {
        });
    }

    watchUsersParticipants(): void {
        this.usersParticipants.valueChanges.pipe().subscribe((value) => {
        });
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

    getTask(taskId: string) {
        this.statusTask = 'charging';
        this.pendingTasks = [];
        this.inProgressTasks = [];
        this.completedTasks = [];
        this.service.getTask(taskId).pipe().subscribe(
            (res: any) => {
                for (let task of res.data) {
                    if (task.status === 'pending') {
                        this.pendingTasks.push(
                            {
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                dateEnd: task.commitment_date,
                                user: task.user
                            }
                        )
                    }
                    if (task.status === 'inProgress') {
                        this.inProgressTasks.push(
                            {
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                dateEnd: task.commitment_date,
                                user: task.user
                            }
                        )
                    }
                    if (task.status === 'completed') {
                        this.completedTasks.push(
                            {
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                dateEnd: task.commitment_date,
                                user: task.user
                            }
                        )
                    }

                }
                this.statusTask = 'complete';
            }, (error) => {
                this.statusTask = 'error';
            })
    }

    getTeachersList() {
        this.service.getTeachersList().pipe().subscribe(
            (res: any) => {
                if (res) {
                    this.usuarios = res.data;
                }
            }, (error) => {

            })
    }

    redirectToUrl() {
        window.open(this.eventSelected.event._def.extendedProps.event_udi.meeting_url, '_blank');
    }

}
