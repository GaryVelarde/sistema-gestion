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
import { MenuItem, Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { finalize } from 'rxjs';
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
    providers: [MessageService],
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
    data = []

    events: EventInput[] = [];

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
    lasParticipantsList = [];
    lasManagersList = [];
    teacherL = userType.teacher;
    eventSelected: any;
    module = eModule.eventUdi;
    edition = false;
    alertForUserDuplicate: Message[] | undefined;
    alertForUserDuplicateEdit: Message[] | undefined;
    public eventForm: FormGroup;
    public slotDurationForm: FormGroup;
    public taskForm: FormGroup;
    public managerForm: FormGroup;
    public participantsForm: FormGroup;
    public managerFormEdit: FormGroup;
    public participantsFormEdit: FormGroup;
    public editForm: FormGroup;
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
    private _usersManager: FormControl = new FormControl([], [
        Validators.required,
    ]);
    private _usersParticipants: FormControl = new FormControl([], [
        Validators.required,
    ]);
    private _usersManagerEdit: FormControl = new FormControl({ value: [], disabled: true }, [
        Validators.required,
    ]);
    private _usersParticipantsEdit: FormControl = new FormControl({ value: [], disabled: true }, [
        Validators.required,
    ]);
    private _titleEdit: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _descriptionEdit: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _eventLinkEdit: FormControl = new FormControl('');
    private _startEdit: FormControl = new FormControl('', [Validators.required]);
    private _endEdit: FormControl = new FormControl('', [Validators.required]);

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
    get usersManagerEdit() {
        return this._usersManagerEdit;
    }
    get usersParticipantsEdit() {
        return this._usersParticipantsEdit;
    }
    get assignedUser() {
        return this._assignedUser;
    }
    get titleEdit() {
        return this._titleEdit;
    }
    get descriptionEdit() {
        return this._descriptionEdit;
    }
    get eventLinkEdit() {
        return this._eventLinkEdit;
    }
    get startEdit() {
        return this._startEdit;
    }
    get endEdit() {
        return this._endEdit;
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
        private messageService: MessageService,
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
        this.editForm = this.fb.group({
            titleEdit: this.titleEdit,
            descriptionEdit: this.descriptionEdit,
            eventLinkEdit: this.eventLinkEdit,
            startEdit: this.startEdit,
            endEdit: this.endEdit,
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
        this.managerFormEdit = this.fb.group({
            usersManagerEdit: this.usersManagerEdit,
        });
        this.participantsFormEdit = this.fb.group({
            usersParticipantsEdit: this.usersParticipantsEdit,
        });
    }

    ngOnInit() {
        this.callGetEventsUdi();
        this.watchUsersManager();
        this.watchUsersParticipants();
        this.watchUsersManagerEdit();
        this.watchUsersParticipantsEdit();
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
        console.log('this.eventSelected.event._def.extendedProps.event_udi', this.eventSelected.event._def.extendedProps.event_udi);
        this.usersManagerEdit.setValue(this.addFullNameProperty(this.eventSelected.event._def.extendedProps.event_udi.managers));
        this.usersParticipantsEdit.setValue(this.addFullNameProperty(this.eventSelected.event._def.extendedProps.event_udi.participants));
        this.getTask(this.eventSelected.event._def.extendedProps.event_udi.id);
        this.showEventDetail = true;
        this.fillFormEdition(this.eventSelected.event._def.extendedProps.event_udi);
        setTimeout(() => {
            this.loaderService.hide();
        }, 400);
    }

    fillFormEdition(data: any) {
        this.titleEdit.setValue(data.title);
        this.descriptionEdit.setValue(data.description);
        this.eventLinkEdit.setValue(data.meeting_url);
        const dateInfo = this.dateFormatService.formatDateWithEndTime(data.start_date)
        console.log('data.start_date', data.start_date)
        console.log('dateInfo', dateInfo)
        this.startEdit.setValue(data.start_date);
        this.endEdit.setValue(this.dateFormatService.formatDateCalendar(data.due_date));
    }

    addFullNameProperty(data: any[]): any[] {
        return data.map(item => ({
            ...item,
            fullName: `${item.name} ${item.surnames}`
        }));
    }

    backCalendar() {
        this.loaderService.show();
        this.showEventDetail = false;
        this.edition = false;
        this.eventSelected = null;
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
            this.loaderService.show(true);
            this.newEventDialog = false;
            const request = {
                title: this.title.value,
                description: this.description.value,
                start_date: this.dateFormatService.formatDateCalendarToBack(this.start.value.toString()),
                due_date: this.dateFormatService.formatDateCalendarToBack(this.start.value.toString()),
                color: this.color.value,
                meeting_url: this.eventLink.value,
                managers_ids: this.extractIds(this.usersManager.value),
                users_ids: this.extractIds(this.usersParticipants.value)
            }
            this.service.postAddNewEvent(request).pipe(
                finalize(() => {
                    this.loaderService.hide();
                })
            ).subscribe(
                (res: any) => {
                    if (res.status) {
                        this.messageService.add({
                            key: 'tst',
                            severity: 'info',
                            summary: 'Confirmación',
                            detail: 'La reunión ha sido guardada.',
                            life: 3000,
                        });
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
                            event_udi: this.event(res.id)
                        };
                        this.events.push(newEvent);
                        const calendarApi = this.calendarComponent.getApi();
                        calendarApi.addEvent(newEvent);
                        this.newEventDialog = false;
                    }
                }, (error) => {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Se ha producido un error al guardar la reunión.',
                        life: 3000,
                    });
                })
        }
    }

    event(id: string) {
        return {
            id: id,
            title: this.title.value,
            description: this.description.value,
            start_date: this.dateFormatService.formatDateCalendarToBack(this.start.value.toString()),
            due_date: this.dateFormatService.formatDateCalendarToBack(this.start.value.toString()),
            color: this.color.value,
            status: "En Progreso",
            meeting_url: this.eventLink.value,
            created_at: "25-09-2024 19:55:13",
            managers: this.usersManager.value,
            participants: this.usersParticipants.value
        }
    }

    extractIds(arr: Array<{ id: string }>): string[] {
        return arr.map(item => item.id);
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
        this.usersManager.valueChanges.pipe().subscribe((value: any[]) => {
            if (value) {
                let hasDuplicate = false;
                const uniqueValues = value.filter((user: any) => {
                    const isDuplicate = this.isUserDuplicate(user, this.participantsForm.get('usersParticipants')?.value);
                    if (isDuplicate) {
                        hasDuplicate = true;
                    }
                    return !isDuplicate;
                });
                this.managerForm.get('usersManager')?.setValue(uniqueValues, { emitEvent: false });
                this.alertForUserDuplicate = hasDuplicate
                    ? [{ severity: 'warn', detail: 'Los encargados y los participantes no pueden ser iguales.' }]
                    : [];
            }
        });
    }

    watchUsersParticipants(): void {
        this.usersParticipants.valueChanges.pipe().subscribe((value: any[]) => {
            if (value) {
                let hasDuplicate = false;
                const uniqueValues = value.filter((user: any) => {
                    const isDuplicate = this.isUserDuplicate(user, this.managerForm.get('usersManager')?.value);
                    if (isDuplicate) {
                        hasDuplicate = true;
                    }
                    return !isDuplicate;
                });
                this.participantsForm.get('usersParticipants')?.setValue(uniqueValues, { emitEvent: false });
                this.alertForUserDuplicate = hasDuplicate
                    ? [{ severity: 'warn', detail: 'Los encargados y los participantes no pueden ser iguales.' }]
                    : [];
            }
        });
    }

    watchUsersManagerEdit(): void {
        this.usersManagerEdit.valueChanges.pipe().subscribe((value: any[]) => {
            if (value) {
                let hasDuplicate = false;
                const uniqueValues = value.filter((user: any) => {
                    const isDuplicate = this.isUserDuplicate(user, this.participantsFormEdit.get('usersParticipantsEdit')?.value);
                    if (isDuplicate) {
                        hasDuplicate = true;
                    }
                    return !isDuplicate;
                });
                this.managerFormEdit.get('usersManagerEdit')?.setValue(uniqueValues, { emitEvent: false });
                this.alertForUserDuplicateEdit = hasDuplicate
                    ? [{ severity: 'warn', detail: 'Los encargados y los participantes no pueden ser iguales.' }]
                    : [];
            }
        });
    }

    watchUsersParticipantsEdit(): void {
        this.usersParticipantsEdit.valueChanges.pipe().subscribe((value: any[]) => {
            if (value) {
                let hasDuplicate = false;
                const uniqueValues = value.filter((user: any) => {
                    const isDuplicate = this.isUserDuplicate(user, this.managerFormEdit.get('usersManagerEdit')?.value);
                    if (isDuplicate) {
                        hasDuplicate = true;
                    }
                    return !isDuplicate;
                });
                this.participantsFormEdit.get('usersParticipantsEdit')?.setValue(uniqueValues, { emitEvent: false });
                this.alertForUserDuplicateEdit = hasDuplicate
                    ? [{ severity: 'warn', detail: 'Los encargados y los participantes no pueden ser iguales.' }]
                    : [];
            }
        });
    }

    isUserDuplicate(user: any, otherList: any[]): boolean {
        return otherList && otherList.some((otherUser: any) => otherUser.id === user.id);
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
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Se ha producido un error al traer la lista de profesores.',
                    life: 3000,
                })
            })
    }

    redirectToUrl() {
        window.open(this.eventSelected.event._def.extendedProps.event_udi.meeting_url, '_blank');
    }

    showEdition() {
        this.lasManagersList = this.usersManagerEdit.value
        this.lasParticipantsList = this.usersParticipantsEdit.value;
        this.usersManagerEdit.enable();
        this.usersParticipantsEdit.enable();
        this.edition = true;
    }

    cancelEdition() {
        this.usersManagerEdit.setValue(this.lasManagersList)
        this.usersParticipantsEdit.setValue(this.lasParticipantsList);
        this.usersManagerEdit.disable();
        this.usersParticipantsEdit.disable();
        this.edition = false;
    }

    showNewEventDialog() {
        this.newEventDialog = true;
    }
}
