import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  constructor() { }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Los meses son 0-indexed
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora 0 debería ser 12
    const strTime = ('0' + hours).slice(-2) + ':' + minutes + ' ' + ampm;

    return `${day}/${month}/${year} ${strTime}`;
  }

  formatDateDDMMYYYY(date: Date | string): string {
    let dateObj: Date;

    // Verificar si el parámetro es una cadena
    if (typeof date === 'string') {
      // Intentar analizar la fecha en formato 'dd-mm-yyyy'
      const parts = date.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
        const year = parseInt(parts[2], 10);
        dateObj = new Date(year, month, day);
      } else {
        // Convertir la cadena al objeto Date si no está en el formato esperado
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    // Asegurarse de que dateObj sea un objeto Date válido
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date');
      return '';
    }

    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }

  formatDateYYYYMMDD(date: Date | string): string {
    let dateObj: Date;

    // Verificar si el parámetro es una cadena
    if (typeof date === 'string') {
      // Intentar analizar la fecha en formato 'dd-mm-yyyy'
      const parts = date.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
        const year = parseInt(parts[2], 10);
        dateObj = new Date(year, month, day);
      } else {
        // Convertir la cadena al objeto Date si no está en el formato esperado
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    // Asegurarse de que dateObj sea un objeto Date válido
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date');
      return '';
    }

    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();

    return `${year}-${month}-${day}`;
  }

  formatDateCalendar(date: string): string {
    let dateObj: Date;

    // Analizar la fecha y la hora en los formatos 'dd-mm-yyyy hh:mm:ss', 'dd-mm-yyyy hh:mm', 'dd/mm/yyyy hh:mm:ss' y 'dd/mm/yyyy hh:mm'
    const dateTimeParts = date.split(' ');
    if (dateTimeParts.length === 2) {
      const datePart = dateTimeParts[0];
      const timePart = dateTimeParts[1];

      let day, month, year, hours, minutes, seconds = 0;

      // Procesar la parte de la fecha
      if (datePart.includes('-')) {
        // Formato 'dd-mm-yyyy'
        const dateParts = datePart.split('-');
        if (dateParts.length === 3) {
          day = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
          year = parseInt(dateParts[2], 10);
        } else {
          console.error('Invalid date format');
          return '';
        }
      } else if (datePart.includes('/')) {
        // Formato 'dd/mm/yyyy'
        const dateParts = datePart.split('/');
        if (dateParts.length === 3) {
          day = parseInt(dateParts[0], 10);
          month = parseInt(dateParts[1], 10) - 1;
          year = parseInt(dateParts[2], 10);
        } else {
          console.error('Invalid date format');
          return '';
        }
      } else {
        console.error('Invalid date format');
        return '';
      }

      // Procesar la parte de la hora
      const timeParts = timePart.split(':');
      if (timeParts.length >= 2) {
        hours = parseInt(timeParts[0], 10);
        minutes = parseInt(timeParts[1], 10);
        if (timeParts.length === 3) {
          // Procesar segundos si están presentes
          seconds = parseInt(timeParts[2], 10);
        }
        dateObj = new Date(year, month, day, hours, minutes, seconds);
      } else {
        console.error('Invalid time format');
        return '';
      }
    } else {
      console.error('Invalid date format');
      return '';
    }

    // Asegurarse de que dateObj sea un objeto Date válido
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date');
      return '';
    }

    const yearStr = dateObj.getFullYear();
    const monthStr = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const dayStr = ('0' + dateObj.getDate()).slice(-2);
    const hoursStr = ('0' + dateObj.getHours()).slice(-2);
    const minutesStr = ('0' + dateObj.getMinutes()).slice(-2);
    const secondsStr = ('0' + dateObj.getSeconds()).slice(-2);

    return `${yearStr}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  formatDateToISO(date: string): string {
    let dateObj: Date;

    // Verificar si la cadena está en el formato 'dd-mm-yyyy hh:mm AM/PM'
    const regexDDMMYYYYAMPM = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2} (AM|PM)$/;
    if (regexDDMMYYYYAMPM.test(date)) {
      const [datePart, timePart, period] = date.split(' ');
      const [day, month, year] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);

      let adjustedHours = hours;
      if (period === 'PM' && hours !== 12) {
        adjustedHours += 12;
      }
      if (period === 'AM' && hours === 12) {
        adjustedHours = 0;
      }

      dateObj = new Date(year, month - 1, day, adjustedHours, minutes);
    } else {
      // Intentar crear un objeto Date a partir de la cadena de entrada
      dateObj = new Date(date);
    }

    // Asegurarse de que dateObj sea un objeto Date válido
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date');
      return '';
    }

    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Los meses en JavaScript son 0-indexados
    const day = ('0' + dateObj.getDate()).slice(-2);
    const hours = ('0' + dateObj.getHours()).slice(-2);
    const minutes = ('0' + dateObj.getMinutes()).slice(-2);
    const seconds = ('0' + dateObj.getSeconds()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  formatDateWithEndTime(date: string): { day: string, start: string, end: string } {
    let dateObj: Date;
    let start: string;
    let end: string;

    if (date.includes('T')) {
      // Parsear el formato "2024-07-26T18:30:00-05:00"
      dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date');
        return { day: '', start: '', end: '' };
      }

      const hours = dateObj.getHours();
      const minutes = ('0' + dateObj.getMinutes()).slice(-2);
      const startHours12 = hours % 12 === 0 ? 12 : hours % 12;
      const startPeriod = hours >= 12 ? 'PM' : 'AM';
      start = `${startHours12}:${minutes} ${startPeriod}`;

      // Calcular una hora más para el end time
      const endDateObj = new Date(dateObj.getTime() + 60 * 60 * 1000);
      const endHours = endDateObj.getHours();
      const endMinutes = ('0' + endDateObj.getMinutes()).slice(-2);
      const endHours12 = endHours % 12 === 0 ? 12 : endHours % 12;
      const endPeriod = endHours >= 12 ? 'PM' : 'AM';
      end = `${endHours12}:${endMinutes} ${endPeriod}`;
    } else {
      // Parsear el formato "2024-07-03"
      const parts = date.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Los meses en JavaScript son 0-indexados
      const day = parseInt(parts[2], 10);

      // Crear el objeto Date usando año, mes y día
      dateObj = new Date(year, month, day);

      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date');
        return { day: '', start: '', end: '' };
      }

      start = '00:00';
      end = '00:00';
    }

    const dayFormatted = ('0' + dateObj.getDate()).slice(-2);
    const monthFormatted = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Los meses en JavaScript son 0-indexados
    const yearFormatted = dateObj.getFullYear();
    const formattedDay = `${dayFormatted}-${monthFormatted}-${yearFormatted}`;

    return { day: formattedDay, start, end };
  }

  formatDateForComments(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat('es-PE', options).format(date);

    // Modificar el formato de la hora
    let [datePart, timePart] = formattedDate.split(', ');
    timePart = timePart.replace(' p. m.', ' pm').replace(' a. m.', ' am');

    return `${datePart.replace(/de /g, '')} - ${timePart}`;
  }

  formatTimeDifference(dateInput: Date | string): string {
    let date: Date;

    // Convert string input to Date
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }

    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `hace ${diffInDays} ${diffInDays > 1 ? 'días' : 'día'}`;
    } else if (diffInHours > 0) {
      return `hace ${diffInHours} ${diffInHours > 1 ? 'horas' : 'hora'}`;
    } else if (diffInMinutes > 0) {
      return `hace ${diffInMinutes} ${diffInMinutes > 1 ? 'minutos' : 'minuto'}`;
    } else {
      return 'hace un momento';
    }
  }

  formatCustomDateByFrontComment(date: Date | string): string {
    let dateObj: Date;

    // Si el parámetro es un string, lo parseamos al formato adecuado
    if (typeof date === 'string') {
      const parts = date.split(/[- :]/); // Divide por guión, espacio y dos puntos
      dateObj = new Date(
        +parts[2],          // Año
        +parts[1] - 1,      // Mes (0 indexado en JS)
        +parts[0],          // Día
        +parts[3],          // Hora
        +parts[4],          // Minutos
        +parts[5]           // Segundos
      );
    } else {
      dateObj = date;
    }

    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    let hour = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');

    // Determinar si es AM o PM
    const period = hour >= 12 ? 'p.m.' : 'a.m.';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    // Formatear la fecha
    return `${day} de ${month} del ${year} a las ${hour}:${minutes} ${period}`;
  }

  transformDDMMYYYY(value: string): string {
    if (!value) return '';
    
    const date = new Date(value);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }


}