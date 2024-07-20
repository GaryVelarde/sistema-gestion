import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
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

@Component({
    selector: 'app-events',
    templateUrl: './events-udi.component.html',
    styleUrls: ['./events-udi.component.scss'],
})
export class EventsUdiComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
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

    constructor(private fb: FormBuilder) {
        this.slotDurationForm = this.fb.group({
            slotDuration: this.slotDuration,
        });
        this.eventForm = this.fb.group({
            title: this.title,
            start: this.start,
            end: this.end,
            color: this.color,
        });
    }

    ngOnInit() {
        this.slotDuration.setValue(this.timeslots[this.timeslots.length - 1]);
        this.watchSlotDuration();
        this.color.setValue('#ff0000');
    }

    ngAfterViewInit(): void {
        this.addButtonToToolbarChunk();
        this.showEventDetailDoalog = false;
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
        this.showEventDetailDoalog = true;
        
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
}
