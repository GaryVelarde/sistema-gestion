import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FileListService {
    private readonly API_URL = environment.apiURL;
    header = {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    }
    constructor(private http: HttpClient) { }

    /**
       Eliminar archivos
    */

    deleteArticleArchive(articleId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/article/${articleId}/archive/${archiveId}`);
    }

    deleteInscriptionArchive(inscriptionId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/inscription/${inscriptionId}/archive/${archiveId}`);
    }

    deleteReviewArchive(reviewId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/review/${reviewId}/archive/${archiveId}`);
    }

    deleteAdvisoryArchive(advisoryId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/advisory/${advisoryId}/archive/${archiveId}`);
    }

    deleteEventUdiArchive(eventId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/meeting/${eventId}/observations/${archiveId}`);
    }

    deletePresentationArchive(eventId: string, archiveId: string) {
        return this.http.delete(`${this.API_URL}/presentation/${eventId}/observations/${archiveId}`);
    }

    /**
      Eliminar archivos
   */

    getPresentationFiles(id: string) {
        return this.http.get(`${this.API_URL}/presentation/${id}/archive`, this.header);
    }

}
