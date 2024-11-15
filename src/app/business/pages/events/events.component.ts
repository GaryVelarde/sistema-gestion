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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [MessageService, DatePipe]
})
export class EventsComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('cardBody') cardBody!: ElementRef;
  resizeObserver!: ResizeObserver;
  scheduleForm: FormGroup;
  activities: any[] = [];
  roomForm: FormGroup;
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

  eventForm: FormGroup;
  directedAtOptions: any[] = [{ name: 'Docentes', code: 'Docentes' }, { name: 'Egresados', code: 'Egresados' }, { name: 'Estudiantes', code: 'Estudiantes' }];
  moderators: any[];
  filteredModerator: any[];
  filteredTopics: any[];
  topics: any[];
  newEventDialog: boolean = false;
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
  eventDetail = false;
  eventSelected: any;
  constructor(
    private fb: FormBuilder,
    private config: PrimeNGConfig,
    private dateFormatService: DateFormatService,
    private service: AuthService,
    private messageService: MessageService,
    private renderer: Renderer2,
    private el: ElementRef,
    private datePipe: DatePipe,
  ) {
    this.slotDurationForm = this.fb.group({
      slotDuration: this.slotDuration,
    });
    this.scheduleForm = this.fb.group({
      time: [''],
      title: [''],
      moderator: [''],
      speaker: [''],
      room: [''],
      posterNumber: [''],
      color: ['#ffffff']
    });
    this.eventForm = this.fb.group({
      name_event: ['', Validators.required],
      description: ['', Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      place: ['', Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      directed_at: [[], Validators.required],
      responsible: ['', Validators.required],
      rooms: this.fb.array([])
    });

  }

  ngOnInit() {
    this.callGetTitlesEvents();
    this.callGetUdiAndTeachersList();
    this.callGetEvents();
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
  }

  handleEventClick(arg) {
    console.log('eventSelected', arg);
    this.loadEventData(arg.event._def.extendedProps.event_detail)
    this.eventSelected = arg;
    this.eventDetail = true;

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
    // this.events = [];
    this.service.getEvents().pipe().subscribe(
      (res: any) => {
        if (res.data) {
          for (let event of res.data) {
            console.log('this.dateFormatService.formatDateCalendar()', this.dateFormatService.formatDateCalendar(event.start_date + ' ' + event.start_time))
            const ev: EventInput = {
              title: event.name_event,
              start: this.dateFormatService.formatDateCalendar(event.start_date + ' ' + event.start_time),
              end: this.dateFormatService.formatDateCalendar(event.end_date + ' ' + event.end_time),
              backgroundColor: '#1e366d',
              borderColor: '#1e366d',
              color: '#1e366d',
              textColor: '#ffffff',
              editable: true,
              startResizable: true,
              durationEditable: true,
              event_detail: event,
              display: 'block'
            }
            this.events = [...this.events, ev];
          }
          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.events
          };
        }
      }, (error) => {

      })
  }

  callGetTitlesEvents() {
    this.service.getTitleEvents().pipe().subscribe(
      (res: any) => {
        if (res.data) {
          this.topics = res.data;
        }
      }, () => {

      })
  }

  get rooms() {
    return this.eventForm.get('rooms') as FormArray;
  }

  addRoom() {
    const roomForm = this.fb.group({
      moderator_id: [null, Validators.required],
      room_number: ['', Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      description: ['', Validators.required],
      topics: this.fb.array([])
    });
    this.rooms.push(roomForm);
  }

  removeRoom(index: number) {
    this.rooms.removeAt(index);
  }

  getTopics(room: FormGroup) {
    return room.get('topics') as FormArray;
  }

  addTopic(room: FormGroup) {
    const topicForm = this.fb.group({
      title: [null, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      authors: [[], Validators.required]
    });
    this.getTopics(room).push(topicForm);
  }

  removeTopic(room: FormGroup, index: number) {
    this.getTopics(room).removeAt(index);
  }

  searchModerator(event: any) {
    this.filteredModerator = this.moderators.filter(person =>
      person.name.toLowerCase().includes(event.query.toLowerCase()) ||
      person.surnames.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  searchTopics(event: any) {
    this.filteredTopics = this.topics.filter(topic =>
      topic.title.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  extractIds(arr: Array<{ id: string }>): { author_id: string }[] {
    return arr.map(item => ({ author_id: item.id }));
  }

  onSubmit() {
    if (true) {
      const formValue = this.eventForm.value;

      formValue.directed_at = this.getCodes(formValue.directed_at);

      formValue.start_date = this.formatDateTimeForBackend(formValue.start_date);
      formValue.end_date = this.formatDateTimeForBackend(formValue.end_date);

      formValue.start_time = this.formatTimeForBackend(formValue.start_date);
      formValue.end_time = this.formatTimeForBackend(formValue.end_date);

      formValue.rooms = formValue.rooms.map((room: any) => ({
        ...room,
        moderator_id: room.moderator_id.id,
        topics: room.topics.map((topic: any) => ({
          ...topic,
          title: topic.title.title,
          authors: this.extractIds(topic.title.authors)
        }))
      }));

      console.log(formValue);
    } else {
      this.markFormGroupTouched(this.eventForm);
    }
  }

  formatDateTimeForBackend(date: Date): string {
    return date ? this.datePipe.transform(date, 'dd-MM-yyyy HH:mm') : null;
  }

  formatTimeForBackend(time: Date): string {
    return time ? this.datePipe.transform(time, 'HH:mm') : null;
  }


  getCodes(arr) {
    return arr.map(item => item.code).join(", ");
  }

  markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  callGetUdiAndTeachersList() {
    this.service.getUdiAndTeachersList().pipe().subscribe(
      (res: any) => {
        if (res.data) {
          this.moderators = res.data;
        }
      }, () => {

      })
  }

  loadEventData(eventData: any): void {
    this.eventForm.reset();
    this.eventForm.patchValue({
      id: eventData.id,
      name_event: eventData.name_event,
      description: eventData.description,
      start_date: eventData.start_date,
      end_date: eventData.end_date,
      place: eventData.place,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      directed_at: eventData.directed_at,
      responsible: eventData.responsible,
      created_at: eventData.created_at,
    });

    eventData.rooms.forEach((room: any) => {
      const roomForm = this.fb.group({
        id: [room.id],
        room_number: [room.room_number],
        start_time: [room.start_time],
        end_time: [room.end_time],
        description: [room.description],
        created_at: [room.created_at],
        moderator: this.fb.group({
          id: [room.moderator.id],
          name: [room.moderator.name],
          surnames: [room.moderator.surnames],
          code: [room.moderator.code],
          email: [room.moderator.email],
          phone: [room.moderator.phone],
          orcid: [room.moderator.orcid],
          cip: [room.moderator.cip]
        }),
        topics: this.fb.array([])
      });

      room.topics.forEach((topic: any) => {
        const topicForm = this.fb.group({
          id: [topic.id],
          title: [topic.title],
          start_time: [topic.start_time],
          end_time: [topic.end_time],
          authors: this.fb.array([])
        });

        topic.authors.forEach((author: any) => {
          const authorForm = this.fb.group({
            id: [author.id],
            author_id: [author.author_id],
            name: [author.name],
            surnames: [author.surnames],
            code: [author.code],
            email: [author.email]
          });
          (topicForm.get('authors') as FormArray).push(authorForm);
        });

        (roomForm.get('topics') as FormArray).push(topicForm);
      });

      this.rooms.push(roomForm);
    });
  }

}
