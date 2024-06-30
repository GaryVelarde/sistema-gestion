import { Component, ViewChild, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/es';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('calendarDetail') calendarDetailComponent: FullCalendarComponent;
    showEventDetailDoalog = false;
    // Define el arreglo de eventos
    events: EventInput[] = [
        {
            title: 'Evento 1',
            start: new Date(),
            backgroundColor: '#FF5733', // Color de fondo del evento
            borderColor: '#D32F2F', // Color del borde del evento (opcional)
            editable: true,
            startResizable: true,
            durationEditable: true,
        },
        {
            title: 'Evento 2',
            start: new Date(),
            backgroundColor: '#337DFF',
            borderColor: '#1565C0',
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
        slotDuration: '00:30:00', // Duración de cada intervalo en 15 minutos
        slotLabelInterval: '00:30', // Etiqueta de cada intervalo en 15 minutos

        //eventContent: this.customEventContent.bind(this),
    };

    calendarOptionsDetail: CalendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
        initialView: 'timeGridWeek',
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
        dateClick: this.handleDateClick.bind(this),
        eventClick: this.handleEventClick.bind(this),
        editable: true,
        selectable: true,
        eventResizableFromStart: true,
        events: this.events,
        eventDrop: this.handleEventDrop.bind(this),
        eventResize: this.handleEventResize.bind(this),
        //eventContent: this.customEventContent.bind(this),
    };

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.eventForm = this.fb.group({
            title: ['', Validators.required],
            start: [null, Validators.required],
            end: [null, Validators.required],
        });
    }

    /*customEventContent(arg) {
        // Puedes personalizar el contenido del evento aquí si es necesario
        const element = document.createElement('div');
        element.innerHTML = `
      <b>${arg.timeText}</b><br>
      ${arg.event.title}
    `;
        return { domNodes: [element] };
    }*/

    updateCalendarOptions(duration: string, interval: string) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.setOption('slotDuration', duration);
        calendarApi.setOption('slotLabelInterval', interval);
    }

    incrementaHorario() {
        this.updateCalendarOptions('00:10:00', '00:10');
    }

    handleDateClick(arg) {
        this.eventForm.reset();
        this.eventForm.patchValue({
            start: arg.date,
            end: arg.date,
        });
        this.displayDialog = true;
    }

    handleEventClick(arg) {
        this.showEventDetailDoalog = true;
        alert('Event clicked: ' + arg.event.title);
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
                title: this.eventForm.value.title,
                start: this.eventForm.value.start,
                end: this.eventForm.value.end,
                allDay: false,
                editable: true,
                startResizable: true,
                durationEditable: true,
            };
            this.events.push(newEvent);
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.addEvent(newEvent);
            this.displayDialog = false;
        }
    }
}
