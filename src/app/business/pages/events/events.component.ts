import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
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
import { PrimeNGConfig } from 'primeng/api';
import { DateFormatService } from 'src/app/services/date-format.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, AfterViewInit {
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    @ViewChild('cardBody') cardBody!: ElementRef;
    resizeObserver!: ResizeObserver;

    // data!: FormArray;
//   columns: string[] = ['A', 'B', 'C', 'D', 'E'];  // Definición inicial de las columnas
//   selectedCells: { row: number, col: number }[] = [];  // Celdas seleccionadas
//   cellStyles: { [key: string]: { backgroundColor?: string, color?: string } } = {};  // Estilos de celdas (fondo, texto)
//   isMouseDown: boolean = false;  // Flag para controlar el estado del mouse
//   startCell: { row: number, col: number } | null = null; // Celda de inicio para selección
//   colorOptions: string[] = ['#FFFFFF', '#FFDDC1', '#FFABAB', '#FFC3A0', '#D9EAD3']; // Opciones de color

scheduleForm: FormGroup;
activities: any[] = [];

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

        this.scheduleForm = this.fb.group({
            time: [''],
            title: [''],
            moderator: [''],
            speaker: [''],
            room: [''],
            posterNumber: [''],
            color: ['#ffffff'] // Default color white
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
        // this.data = new FormArray(this.createRows(5));  // 5 filas por defecto

    }

    addActivity() {
        const newActivity: any = this.scheduleForm.value;
        this.activities.push(newActivity);
        this.scheduleForm.reset(); // Limpiar el formulario
      }
    

//    // Función para crear filas
//   createRows(numRows: number): FormGroup[] {
//     const rows: FormGroup[] = [];
//     for (let i = 0; i < numRows; i++) {
//       const row = new FormGroup(this.createColumns());
//       rows.push(row);
//     }
//     return rows;
//   }

//   // Función para crear columnas como FormControls
//   createColumns(): { [key: string]: FormControl } {
//     const cols: { [key: string]: FormControl } = {};
//     for (let i = 0; i < this.columns.length; i++) {
//       cols[i] = new FormControl('');  // Inicializa cada celda vacía
//     }
//     return cols;
//   }

//   // Función para manejar el evento mouse down
//   onMouseDown(row: number, col: number, event: MouseEvent) {
//     this.isMouseDown = true;  // Activa el estado de mouse presionado
//     this.startCell = { row, col }; // Guarda la celda de inicio
//     this.clearSelectedCells(); // Limpia la selección previa
//     this.selectCell(row, col); // Selecciona la celda inicial
//     event.preventDefault(); // Evita el comportamiento predeterminado
//   }

//   // Función para manejar el evento mouse over para selección múltiple
//   onMouseOver(row: number, col: number) {
//     if (this.isMouseDown) {
//       if (this.startCell) {
//         const startRow = this.startCell.row;
//         const startCol = this.startCell.col;
//         this.selectRange(startRow, startCol, row, col); // Selecciona un rango
//       }
//     }
//   }

//   // Función para manejar el evento mouse up
//   onMouseUp() {
//     this.isMouseDown = false;  // Desactiva el estado de mouse presionado
//     this.startCell = null; // Resetea la celda de inicio
//   }

//   // Función para seleccionar un rango de celdas
//   selectRange(startRow: number, startCol: number, endRow: number, endCol: number) {
//     const rowMin = Math.min(startRow, endRow);
//     const rowMax = Math.max(startRow, endRow);
//     const colMin = Math.min(startCol, endCol);
//     const colMax = Math.max(startCol, endCol);

//     for (let row = rowMin; row <= rowMax; row++) {
//       for (let col = colMin; col <= colMax; col++) {
//         this.selectCell(row, col);  // Selecciona cada celda en el rango
//       }
//     }
//   }

//   // Función para seleccionar una celda
//   selectCell(row: number, col: number) {
//     const cellIndex = this.selectedCells.findIndex(c => c.row === row && c.col === col);
//     if (cellIndex === -1) {
//       // Si la celda no está ya seleccionada, se agrega a la selección
//       this.selectedCells.push({ row, col });
//     } else {
//       // Si la celda ya estaba seleccionada, se elimina de la selección
//       this.selectedCells.splice(cellIndex, 1);
//     }
//   }

//   // Función para aplicar color de fondo a las celdas seleccionadas
//   applyBackgroundColor(color: string) {
//     this.selectedCells.forEach(cell => {
//       const key = `${cell.row}-${cell.col}`;
//       if (!this.cellStyles[key]) this.cellStyles[key] = {};
//       this.cellStyles[key].backgroundColor = color;  // Cambia el fondo
//     });
//   }

//   // Función para aplicar color de texto a las celdas seleccionadas
//   applyTextColor(color: string) {
//     this.selectedCells.forEach(cell => {
//       const key = `${cell.row}-${cell.col}`;
//       if (!this.cellStyles[key]) this.cellStyles[key] = {};
//       this.cellStyles[key].color = color;  // Cambia el color de texto
//     });
//   }

//   // Función para obtener el estilo de una celda
//   getCellStyle(row: number, col: number) {
//     const key = `${row}-${col}`;
//     return this.cellStyles[key] || {}; // Retorna el estilo guardado para la celda
//   }

//   // Función para verificar si una celda está seleccionada
//   isCellSelected(row: number, col: number) {
//     return this.selectedCells.some(c => c.row === row && c.col === col);
//   }

//   // Función para agregar una nueva fila
//   addRow() {
//     const newRow = new FormGroup(this.createColumns());
//     this.data.push(newRow);
//   }

//   // Función para agregar una nueva columna
//   addColumn() {
//     const newColIndex = this.columns.length;
//     this.columns.push(this.getColumnLetter(newColIndex));
//     this.data.controls.forEach(row => {
//       (row as FormGroup).addControl(newColIndex.toString(), new FormControl(''));
//     });
//   }

//   // Función auxiliar para generar el nombre de la nueva columna (F, G, H, etc.)
//   getColumnLetter(index: number): string {
//     return String.fromCharCode(65 + index);  // 65 es 'A' en ASCII
//   }

//   // Función para desmarcar celdas seleccionadas
//   clearSelectedCells() {
//     this.selectedCells = [];  // Limpiar selección
//   }






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
