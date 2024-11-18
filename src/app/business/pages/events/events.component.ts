import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
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
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
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
  edition = false;
  chargingEdition = false;
  roomForm: FormGroup;
  showEventDetailDoalog = true;
  timeslots = [
    { name: '10 minutos', code: '00:10:00' },
    { name: '15 minutos', code: '00:15:00' },
    { name: '20 minutos', code: '00:20:00' },
    { name: '30 minutos', code: '00:30:00' },
  ];
  breadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Eventos' },
    { label: 'Agenda UDI', visible: true },
  ];
  detailsBreadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Eventos' },
    { label: 'Agenda UDI' },
    { label: 'Detalle de la reunión', visible: true },
  ];
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
  };
  startTime: any;
  endTime: any;
  directedAt: any;
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
    this.scheduleForm.reset();
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
    console.log('eventSelected', arg.event._def.extendedProps.event_detail);
    this.eventSelected = arg;
    this.eventDetail = true;
    this.startTime = arg.event._def.extendedProps.event_detail.start_date + ' ' + arg.event._def.extendedProps.event_detail.start_time;
    this.endTime = arg.event._def.extendedProps.event_detail.end_date + ' ' + arg.event._def.extendedProps.event_detail.end_time;
    this.directedAt = this.parseCommaSeparatedString(arg.event._def.extendedProps.event_detail.directed_at)
  }

  handleEventDrop(eventDropInfo) {
    alert('Event dropped to ' + eventDropInfo.event.start);
  }

  handleEventResize(eventResizeInfo) {
    alert('Event resized to ' + eventResizeInfo.event.end);
  }

  backCalendar() {
    this.callGetEvents();
    this.eventDetail = false;
    this.eventSelected = null;
    this.eventForm.reset();
    this.rooms.clear();
    this.edition = false;
  }

  showEdition() {
    this.edition = true;
    this.addEventDataToForm(this.eventSelected.event._def.extendedProps.event_detail)
  }

  cancelEdition() {
    this.edition = false;
  }

  saveEdition() {
    this.chargingEdition = true;
    const formValue = this.eventForm.value;

    formValue.directed_at = this.getCodes(formValue.directed_at);

    formValue.start_time = this.formatTimeForBackend(formValue.start_date);
    formValue.end_time = this.formatTimeForBackend(formValue.end_date);

    formValue.start_date = this.formatDateToDDMMYYYY(formValue.start_date);
    formValue.end_date = this.formatDateToDDMMYYYY(formValue.end_date);


    formValue.rooms = formValue.rooms.map((room: any) => ({
      ...room,
      moderator_id: room.moderator.id,
      end_time: this.formatTimeForBackend(room.end_time),
      start_time: this.formatTimeForBackend(room.start_time),
      topics: room.topics.map((topic: any) => ({
        ...topic,
        start_time: this.formatTimeForBackend(topic.start_time),
        end_time: this.formatTimeForBackend(topic.end_time),
        title: topic.title.title ? topic.title.title : topic.title,
        authors: this.extractIdsWhitId(topic.authors.length ? topic.authors : topic.title.authors)
      }))
    }));

    console.log('formValue', formValue)

    this.service.putEventUpdate(formValue, this.eventSelected.event._def.extendedProps.event_detail.id).
      pipe().
      subscribe(
        (res: any) => {
          if (res.status) {
            this.callGetEventById();
            this.messageService.add({
              key: 'tst',
              severity: 'info',
              summary: 'Confirmación',
              detail: 'El evento ha sido actualizado.',
              life: 3000,
            });
          }
        }, () => {
          this.edition = false;
          this.chargingEdition = false;
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'Se ha producido un error al guardar el evento.',
            life: 3000,
          });
        })
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
    this.events = [];
    this.service.getEvents().pipe().subscribe(
      (res: any) => {
        if (res.data) {
          for (let event of res.data) {
            const ev: EventInput = {
              title: event.name_event,
              start: this.convertToISOFormat(event.start_date + ' ' + event.start_time),
              end: this.convertToISOFormat(event.end_date + ' ' + event.end_time),
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

  convertToISOFormat(dateString: string): string | null {
    console.log('dateString', dateString)
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-").map(Number);

    let [hour, minute] = timePart.split(/[: ]/).slice(0, 2).map(Number);
    const period = timePart.split(" ")[1];

    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    const formattedDate = new Date(year, month - 1, day, hour, minute);

    const isoFormattedDate = formattedDate.toISOString().slice(0, 19);

    return isoFormattedDate;
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
      moderator_id: [[], Validators.required],
      moderator: [[], Validators.required],
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
    console.log('this.filteredModerator', this.filteredModerator)
  }

  searchTopics(event: any) {
    this.filteredTopics = this.topics.filter(topic =>
      topic.title.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  extractIds(arr: Array<{ author_id: string }>): { author_id: string }[] {
    return arr.map(item => ({ author_id: item.author_id }));
  }

  extractIdsWhitId(arr: Array<{ id: string, author_id: string }>): { id: string, author_id: string }[] {
    return arr.map(item => ({ id: item.id, author_id: item.author_id }));
  }

  onSubmit() {
    const formValue = this.eventForm.value;

    formValue.directed_at = this.getCodes(formValue.directed_at);

    formValue.start_time = this.formatTimeForBackend(formValue.start_date);
    formValue.end_time = this.formatTimeForBackend(formValue.end_date);

    formValue.start_date = this.formatDateToDDMMYYYY(formValue.start_date);
    formValue.end_date = this.formatDateToDDMMYYYY(formValue.end_date);

    formValue.rooms = formValue.rooms.map((room: any) => ({
      ...room,
      moderator_id: room.moderator_id.id,
      end_time: this.formatTimeForBackend(room.end_time),
      start_time: this.formatTimeForBackend(room.start_time),
      topics: room.topics.map((topic: any) => ({
        ...topic,
        start_time: this.formatTimeForBackend(topic.start_time),
        end_time: this.formatTimeForBackend(topic.end_time),
        title: topic.title.title,
        authors: this.extractIds(topic.title.authors)
      }))
    }));

    console.log(formValue);

    this.service.postAddEvent(formValue).pipe().
      subscribe((res: any) => {
        if (res.status) {
          this.callGetEvents();
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'El evento ha sido guardado.',
            life: 3000,
          });
        }
      }, () => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se ha producido un error al guardar el evento.',
          life: 3000,
        });
      })
  }

  formatTimeForBackend(dateInput: Date | string): string | null {
    console.log('dateInput', dateInput);
    if (!dateInput) return null;

    if (typeof dateInput === 'string') {
        // Verifica si el formato es "HH:mm AM/PM"
        const regex12HourFormat = /^\d{1,2}:\d{2} (AM|PM)$/;
        if (regex12HourFormat.test(dateInput.trim())) {
            return dateInput.trim();
        }

        // Verifica si el formato es "DD-MM-YYYY HH:mm AM/PM"
        const regexDateWithTime = /^\d{2}-\d{2}-\d{4} \d{1,2}:\d{2} (AM|PM)$/;
        if (regexDateWithTime.test(dateInput.trim())) {
            // Convierte el string al objeto Date
            const [datePart, timePart] = dateInput.split(' ');
            const [day, month, year] = datePart.split('-').map(Number);
            const [time, period] = timePart.split(' ');
            const [hours, minutes] = time.split(':').map(Number);

            let parsedHours = hours % 12;
            if (period === 'PM') {
                parsedHours += 12;
            }

            const parsedDate = new Date(year, month - 1, day, parsedHours, minutes);
            if (isNaN(parsedDate.getTime())) {
                console.error('Formato de fecha no válido:', dateInput);
                return null;
            }
            dateInput = parsedDate;
        } else {
            // Intenta analizar cualquier otro formato estándar
            const parsedDate = new Date(dateInput);
            if (isNaN(parsedDate.getTime())) {
                console.error('Formato de fecha no válido:', dateInput);
                return null;
            }
            dateInput = parsedDate;
        }
    }

    if (dateInput instanceof Date) {
        let hours = dateInput.getHours();
        const minutes = dateInput.getMinutes();

        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes} ${period}`;
    }

    return null;
}

  formatDateToDDMMYYYY(dateInput: string): string | null {
    console.log('formatDateToDDMMYYYY', dateInput);
    if (!dateInput) return null;

    let date: Date;

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateInput)) {
      date = new Date(dateInput);
    } else if (/^\d{2}-\d{2}-\d{4} \d{1,2}:\d{2} (AM|PM)$/.test(dateInput)) {
      const [datePart, timePart, period] = dateInput.split(/[\s:]/);
      const [day, month, year] = datePart.split('-').map(Number);
      let hours = parseInt(timePart, 10);
      const minutes = parseInt(dateInput.split(':')[1], 10);

      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      date = new Date(year, month - 1, day, hours, minutes);
    } else if (/^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4} \(.+\)$/.test(dateInput)) {
      date = new Date(dateInput);
    } else {
      console.error('Formato de fecha no válido:', dateInput);
      return null;
    }

    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateInput);
      return null;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
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

  addEventDataToForm(eventData: any) {
    console.log('eventData', eventData)
    this.eventForm.reset();
    this.rooms.clear();
    this.eventForm.patchValue({
      id: eventData.id,
      name_event: eventData.name_event,
      description: eventData.description,
      start_date: eventData.start_date + ' ' + eventData.start_time,
      end_date: eventData.end_date + ' ' + eventData.end_time,
      place: eventData.place,
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      directed_at: this.parseCommaSeparatedString(eventData.directed_at),
      responsible: eventData.responsible,
      created_at: eventData.created_at,
    });

    const roomsFormArray = this.eventForm.get('rooms') as FormArray;
    eventData.rooms.forEach((room: any) => {
      const roomGroup = this.fb.group({
        id: room.id,
        moderator: this.fb.group({
          id: room.moderator.id,
          name: room.moderator.name,
          surnames: room.moderator.surnames,
          code: room.moderator.code,
          email: room.moderator.email,
          phone: room.moderator.phone,
          orcid: room.moderator.orcid,
          cip: room.moderator.cip,
        }),
        room_number: room.room_number,
        start_time: room.start_time,
        end_time: room.end_time,
        description: room.description,
        created_at: room.created_at,
        topics: this.fb.array([]),
      });

      const topicsFormArray = roomGroup.get('topics') as FormArray;
      room.topics.forEach((topic: any) => {
        const topicGroup = this.fb.group({
          id: topic.id,
          title: topic.title,
          start_time: topic.start_time,
          end_time: topic.end_time,
          authors: this.fb.array([]),
        });

        const authorsFormArray = topicGroup.get('authors') as FormArray;
        topic.authors.forEach((author: any) => {
          const authorGroup = this.fb.group({
            id: author.id,
            author_id: author.author_id,
            name: author.name,
            surnames: author.surnames,
            code: author.code,
            email: author.email,
          });
          authorsFormArray.push(authorGroup);
        });

        topicsFormArray.push(topicGroup);
      });

      roomsFormArray.push(roomGroup);
    });
  }


  parseCommaSeparatedString(input: string): { name: string; code: string }[] {
    return input.split(',').map((item) => {
      const trimmedItem = item.trim();
      return {
        name: trimmedItem,
        code: trimmedItem
      };
    });
  }

  convertTo12HourFormat(time24: string): string {
    const [hours, minutes] = time24.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';

    const hours12 = hours % 12 || 12;

    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  callGetEventById() {
    this.service.getEventById(this.eventSelected.event._def.extendedProps.event_detail.id)
      .pipe()
      .subscribe((res: any) => {
        if (res) {
          console.log('Antes:', this.eventSelected.event._def.extendedProps.event_detail);

          // Crear una nueva referencia con las propiedades modificadas
          this.eventSelected.event._def.extendedProps = {
            ...this.eventSelected.event._def.extendedProps,
            event_detail: res.data // Asignar la nueva información
          };
          this.chargingEdition = false;
          this.edition = false;
          this.startTime = this.eventSelected.event._def.extendedProps.event_detail.start_date + ' ' + this.eventSelected.event._def.extendedProps.event_detail.start_time;
          this.endTime = this.eventSelected.event._def.extendedProps.event_detail.end_date + ' ' + this.eventSelected.event._def.extendedProps.event_detail.end_time;
          console.log('Después:', this.eventSelected.event._def.extendedProps.event_detail);
        }
      }, () => {
        console.error('Error al obtener el evento');
      });
  }

}
