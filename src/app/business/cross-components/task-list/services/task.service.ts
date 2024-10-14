import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private readonly API_URL = environment.apiURL;
    header = {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    }
    constructor(private http: HttpClient) { }

    /**
       Eliminar tareas
    */

    deleteArticleTask(articleId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/article/${articleId}/tasks/${taskId}`, this.header);
    }

    deleteInscriptionTask(inscriptionId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/inscription/${inscriptionId}/tasks/${taskId}`, this.header);
    }

    deleteReviewTask(reviewId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/review/${reviewId}/tasks/${taskId}`, this.header);
    }

    deleteAdvisoryTask(advisoryId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/advisory/${advisoryId}/tasks/${taskId}`, this.header);
    }

    deleteEventUdiTask(eventId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/meeting/${eventId}/tasks/${taskId}`, this.header);
    }

    /**
       Actualizar status tareas
    */

    putEventUdiUpdateStatusTask(eventId: string, taskId: string, request: any) {
        return this.http.put(`${this.API_URL}/meeting/${eventId}/tasks/${taskId}/status`, request, this.header);
    }

    putInscriptionUpdateStatusTask(eventId: string, taskId: string, request: any) {
        return this.http.put(`${this.API_URL}/inscription/${eventId}/tasks/${taskId}/status`, request, this.header);
    }

    putAdvisoryUpdateStatusTask(eventId: string, taskId: string, request: any) {
        return this.http.put(`${this.API_URL}/advisory/${eventId}/tasks/${taskId}/status`, request, this.header);
    }

}
