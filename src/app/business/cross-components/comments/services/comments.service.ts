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

    /**
        Actualizar comentarios
     */
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

    putArticleCommentUpdate(articleId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/article/${articleId}/observations/${commentId}`, request, this.header);
    }

    putPresentationCommentUpdate(articleId: string, commentId: string, request: any) {
        return this.http.put(`${this.API_URL}/presentation/${articleId}/observations/${commentId}`, request, this.header);
    }

    /**
       Eliminar comentarios
    */

    deleteArticleComment(articleId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/article/${articleId}/observations/${commentId}`);
    }

    deleteInscriptionComment(inscriptionId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/inscription/${inscriptionId}/observations/${commentId}`);
    }

    deleteReviewComment(reviewId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/review/${reviewId}/observations/${commentId}`);
    }

    deleteAdvisoryComment(advisoryId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/advisory/${advisoryId}/observations/${commentId}`);
    }

    deleteEventUdiComment(eventId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/meeting/${eventId}/observations/${commentId}`);
    }

    deletePresentationComment(eventId: string, commentId: string) {
        return this.http.delete(`${this.API_URL}/presentation/${eventId}/observations/${commentId}`);
    }

    /**
      Listar comentarios
    */

    getCommentsByThesisReview(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/review/${id}/observations`, this.header);
    }

    getCommentsByPresentation(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/presentation/${id}/observations`, this.header);
    }

    /**
      Registrar comentarios
    */

    postAddThesisReviewComment(id: any, request: any) {
        return this.http.post(`${this.API_URL}/review/${id}/observations`, request, this.header);
    }

    postAddPresentationComment(id: any, request: any) {
        return this.http.post(`${this.API_URL}/presentation/${id}/observations`, request, this.header);
    }


}
