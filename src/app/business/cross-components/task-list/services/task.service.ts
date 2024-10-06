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
        return this.http.delete(`${this.API_URL}/article/${articleId}/tasks/${taskId}`);
    }

    deleteInscriptionTask(inscriptionId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/inscription/${inscriptionId}/tasks/${taskId}`);
    }

    deleteReviewTask(reviewId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/review/${reviewId}/tasks/${taskId}`);
    }

    deleteAdvisoryTask(advisoryId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/advisory/${advisoryId}/tasks/${taskId}`);
    }

    deleteEventUdiTask(eventId: string, taskId: string) {
        return this.http.delete(`${this.API_URL}/meeting/${eventId}/tasks/${taskId}`);
    }

}
