import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
import { PrimeNGConfig } from 'primeng/api';
import { DateFormatService } from 'src/app/services/date-format.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('calendarDetail') calendarDetailComponent: FullCalendarComponent;
    @ViewChild('cardBody') cardBody!: ElementRef;
    resizeObserver!: ResizeObserver;

    showEventDetailDoalog = true;
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

    eventsDetail: EventInput[] = [
        {
            title: 'Reunion de profesores',
            start: new Date(),
            backgroundColor: '#FF5733', // Color de fondo del evento
            borderColor: '#D32F2F', // Color del borde del evento (opcional)
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
    ];

    // Formulario reactivo
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
    private _title: FormControl = new FormControl('', [Validators.required]);
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
    get title() {
        return this._title;
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

    constructor(private fb: FormBuilder, private config: PrimeNGConfig, private dateFormatService: DateFormatService,) {
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
    }

    ngOnInit() {
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
        console.log('this.color.value', this.color.value)
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
        this.calendarDetailComponent
            .getApi()
            .setOption('events', this.eventsDetail);
    }

    renderizeCalendarDetails() {
        this.calendarDetailComponent.getApi().render();
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
}
