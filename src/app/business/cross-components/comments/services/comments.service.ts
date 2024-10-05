import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private readonly API_URL = environment.apiURL;
    header = {
        headers: {
            'ngrok-skip-browser-warning': 'true'
        }
    }
    constructor(private http: HttpClient) { }

    putInscriptionCommentUpdate(inscriptionId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/inscription/${inscriptionId}/observations/${commentId}`, request, this.header);
    }

    putAdvisoryCommentUpdate(advisoryId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/advisory/${advisoryId}/observations/${commentId}`, request, this.header);
    }

    putReviewCommentUpdate(reviewId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/review/${reviewId}/observations/${commentId}`, request, this.header);
    }

    putEventUdiCommentUpdate(eventId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/meeting/${eventId}/observations/${commentId}`, request, this.header);
    }
}
