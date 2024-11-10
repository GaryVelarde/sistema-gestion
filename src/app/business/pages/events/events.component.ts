import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DateFormatService } from 'src/app/services/date-format.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
    providers: [MessageService]
})
export class EventsComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('cardBody') cardBody!: ElementRef;
    resizeObserver!: ResizeObserver;
    scheduleForm: FormGroup;
    activities: any[] = [];
    roomForm: FormGroup;
    titles: any[] = [];
    showEventDetailDoalog = true;
    timeslots = [
        { name: '10 minutos', code: '00:10:00' },
        { name: '15 minutos', code: '00:15:00' },
        { name: '20 minutos', code: '00:20:00' },
        { name: '30 minutos', code: '00:30:00' },
    ];
    events: EventInput[] = [
        {
            title: 'Evento 1',
            start: new Date(),
            backgroundColor: '#FF5733',
            borderColor: '#FF5733',
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
    eventsDetail: EventInput[] = [
        {
            title: 'Reunion de profesores',
            start: new Date(),
            backgroundColor: '#FF5733',
            borderColor: '#D32F2F',
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
    ];
    eventForm: FormGroup;
    newEventDialog: boolean = false;
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

    calendarOptionsDetail: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'timeGridDay',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
        },
        buttonText: {
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            list: 'Lista',
        },
        locale: esLocale,
        dateClick: this.handleDetailDateClick.bind(this),
        //eventClick: this.handleEventClick.bind(this),
        editable: true,
        selectable: true,
        eventResizableFromStart: true,
        eventDrop: this.handleEventDrop.bind(this),
        eventResize: this.handleEventResize.bind(this),
    };
    public slotDurationForm: FormGroup;
    private _slotDuration: FormControl = new FormControl('', [
        Validators.required,
    ]);
    private _eventTitle: FormControl = new FormControl('', [Validators.required]);
    private _start: FormControl = new FormControl('', [Validators.required]);
    private _end: FormControl = new FormControl('', [Validators.required]);
    private _color: FormControl = new FormControl('#ff0000', [
        Validators.required,
    ]);
    private _eventLink: FormControl = new FormControl('');
    private _description: FormControl = new FormControl('', [
        Validators.required,
    ]);

    get slotDuration() {
        return this._slotDuration;
    }
    get eventTitle() {
        return this._eventTitle;
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get color() {
        return this._color;
    }
    get eventLink() {
        return this._eventLink;
    }
    get description() {
        return this._description;
    }

    constructor(
        private fb: FormBuilder,
        private config: PrimeNGConfig,
        private dateFormatService: DateFormatService,
        private service: AuthService,
        private messageService: MessageService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {
        this.slotDurationForm = this.fb.group({
            slotDuration: this.slotDuration,
        });
        this.eventForm = this.fb.group({
            title: this.eventTitle,
            description: this.description,
            eventLink: this.eventLink,
            start: this.start,
            end: this.end,
            color: this.color,
        });

        this.scheduleForm = this.fb.group({
            time: [''],
            title: [''],
            moderator: [''],
            speaker: [''],
            room: [''],
            posterNumber: [''],
            color: ['#ffffff'] // Default color white
        });
        this.roomForm = this.fb.group({
            rooms: this.fb.array([this.createRoom()])
        });

    }

    ngOnInit() {
        this.callGetTitlesEvents();
        this.listenToTopicTitleChanges();
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

    addActivity() {
        const newActivity: any = this.scheduleForm.value;
        this.activities.push(newActivity);
        this.scheduleForm.reset(); // Limpiar el formulario
    }

    ngAfterViewInit(): void {
        this.showEventDetailDoalog = false;
        this.resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                this.renderizeCalendar();
            }
        });
        if (this.cardBody && this.cardBody.nativeElement) {
            this.resizeObserver.observe(this.cardBody.nativeElement);
        }
    }

    test() {
        const elementos = this.el.nativeElement.querySelectorAll('div.p-overlay.p-component.ng-star-inserted');
        elementos.forEach((elemento: HTMLElement) => {
            this.renderer.setStyle(elemento, 'width', '90%');
            this.renderer.setStyle(elemento, 'max-width', '90%');
        });
    }

    renderizeCalendar() {
        this.calendarComponent.getApi().render();
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

    handleDetailDateClick(arg) {
        this.eventForm.reset();
        this.eventForm.patchValue({
            start: arg.date,
            end: arg.date,
        });
        this.newEventDialog = true;
    }

    handleEventClick(arg) {
        this.showEventDetailDoalog = true;

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
                title: this.eventTitle.value,
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

    callGetEvents() {
        this.service.getEvents().pipe().subscribe(
            (res: any) => {
            }, (error) => {

            })
    }

    callGetTitlesEvents() {
        this.service.getTitleEvents().pipe().subscribe(
            (res: any) => {
                if (res.data) {
                    this.titles = res.data;
                }
            }, (error) => {

            })
    }

    createRoom(): FormGroup {
        return this.fb.group({
            moderator_id: ['', Validators.required],
            room_number: ['', Validators.required],
            start_time: ['', Validators.required],
            end_time: ['', Validators.required],
            description: ['', Validators.required],
            topics: this.fb.array([this.createTopic()])
        });
    }

    createTopic(): FormGroup {
        return this.fb.group({
            title: ['', Validators.required],
            start_time: ['', Validators.required],
            end_time: ['', Validators.required],
            authors: this.fb.array([this.createAuthor()])
        });
    }

    createAuthor(): FormGroup {
        return this.fb.group({
            author_id: ['', Validators.required]
        });
    }

    get rooms(): FormArray {
        return this.roomForm.get('rooms') as FormArray;
    }

    addRoom() {
        this.rooms.push(this.createRoom());
    }

    removeRoom(index: number) {
        this.rooms.removeAt(index);
    }

    addTopic(roomIndex: number) {
        const topics = this.rooms.at(roomIndex).get('topics') as FormArray;
        topics.push(this.createTopic());
    }

    removeTopic(roomIndex: number, topicIndex: number) {
        const topics = this.rooms.at(roomIndex).get('topics') as FormArray;
        topics.removeAt(topicIndex);
    }

    addAuthor(roomIndex: number, topicIndex: number) {
        const topics = this.rooms.at(roomIndex).get('topics') as FormArray;
        const authors = topics.at(topicIndex).get('authors') as FormArray;
        authors.push(this.createAuthor());
    }

    removeAuthor(roomIndex: number, topicIndex: number, authorIndex: number) {
        const topics = this.rooms.at(roomIndex).get('topics') as FormArray;
        const authors = topics.at(topicIndex).get('authors') as FormArray;
        authors.removeAt(authorIndex);
    }

    submitForm() {
    }

    listenToTopicTitleChanges() {
        const roomsArray = this.roomForm.get('rooms') as FormArray;
      
        roomsArray.controls.forEach((roomGroup: FormGroup, roomIndex: number) => {
          const topicsArray = roomGroup.get('topics') as FormArray;
      
          topicsArray.controls.forEach((topicGroup: FormGroup, topicIndex: number) => {
            const titleControl = topicGroup.get('title');
      
            // Suscribirse a los cambios del campo 'title' de cada 'topic'
            titleControl?.valueChanges.subscribe((newTitleValue) => {             
              this.onTitleChange(roomIndex, topicIndex, newTitleValue);
            });
          });
        });
      }
      
      onTitleChange(roomIndex: number, topicIndex: number, newTitleValue: string) {
      }
      
}
