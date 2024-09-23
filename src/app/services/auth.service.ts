import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthCredentials } from '../models/auth-credentials.model';
import { UserRegister } from '../models/user-register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiURL;
  header = {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  }
  constructor(private http: HttpClient) { }

  login(credentials: AuthCredentials): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials, this.header);
  }

  forgotPassword(request: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password`, request, this.header);
  }

  resetPassword(request: any, token: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/reset-password/${token}`, request, this.header);
  }

  postInscription(rq: any): Observable<any> {
    return this.http.post(`${this.API_URL}/inscription`, rq);
  }

  getInscription(): Observable<any> {
    return this.http.get(`${this.API_URL}/inscription`, this.header);
  }

  logout(): Observable<any> {
    return this.http.delete(`${this.API_URL}/logout`);
  }

  postCount(): Observable<any> {
    return this.http.get(`${this.API_URL}/post/count-posts`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }

  postUserCountFriends(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/count-friends`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }

  postCreateNewUser(rq: any): Observable<any> {
    return this.http.post(`${this.API_URL}/users`, rq, this.header);
  }

  getUserList(): Observable<any> {
    return this.http.get(`${this.API_URL}/users`, this.header);
  }

  getTeachersList(): Observable<any> {
    return this.http.get(`${this.API_URL}/teachers`, this.header);
  }

  getStudentsList(): Observable<any> {
    return this.http.get(`${this.API_URL}/graduates-students`, this.header);
  }

  getSeedBeds(): Observable<any> {
    return this.http.get(`${this.API_URL}/seedbeds`, this.header);
  }

  getTask(taskId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/meeting/${taskId}/task`, this.header);
  }

  updateStatusTask(reunionId: string, taskId: string, status: string) {
    return this.http.put(`${this.API_URL}/meeting/${reunionId}/task/${taskId}/status`,
      {
        "status": status
      },
      this.header);
  }

  deleteTask(reunionId: string, taskId: string) {
    return this.http.delete(`${this.API_URL}/meeting/${reunionId}/task/${taskId}`, this.header);
  }

  updateTaskDetail(reunionId: string, taskId: string, request: any){
    return this.http.put(`${this.API_URL}/meeting/${reunionId}/task/${taskId}`, request, this.header);
  }

  addTask(reunionId: string, request: any) {
    return this.http.post(`${this.API_URL}/meeting/${reunionId}/task`, request, this.header);
  }

  postRegisterArticle(request: any) {
    return this.http.post(`${this.API_URL}/article`, request, this.header);
  }

  postRegisterArticleFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/article/${id}/archive`, request, this.header);
  }

  getArticleList(): Observable<any> {
    return this.http.get(`${this.API_URL}/article`, this.header);
  }

  getCommentsByInscription(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/inscription/${id}/observations`, this.header);
  }

  getCommentsByAdvisory(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/advisory/${id}/observations`, this.header);
  }

  getCommentsByEventsUDI(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/meeting/${id}/observation`, this.header);
  }

  getAdvisoryList(): Observable<any> {
    return this.http.get(`${this.API_URL}/advisory`, this.header);
  }

  putUser(id: number, request: any) {
    return this.http.put(`${this.API_URL}/users/${id}`, request, this.header);
  }

  putInscriptionStatusUpdate(id: number, request: any) {
    return this.http.put(`${this.API_URL}/inscription/${id}/status`, request, this.header);
  }

  postAddInscriptionComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/inscription/${id}/observations`, request, this.header);
  }

  postAddEventsUdiComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/meeting/${id}/observation`, request, this.header);
  }

  closeSession() {
    return this.http.delete(`${this.API_URL}/logout`, this.header);
  }

  getEventsUdiList() {
    return this.http.get(`${this.API_URL}/meeting`, this.header);
  }

  putAdvisoryUpdate(id: number, request: any) {
    return this.http.put(`${this.API_URL}/advisory/${id}`, request, this.header);
  }

  getAdvisoryTasks(id: string) {
    return this.http.get(`${this.API_URL}/advisory/${id}/tasks`, this.header);
  }

  getInscriptionTasks(id: string) {
    return this.http.get(`${this.API_URL}/inscription/${id}/tasks`, this.header);
  }

  postAddInscriptionTask(id: string, request: any) {
    return this.http.post(`${this.API_URL}/inscription/${id}/tasks`, request, this.header);
  }

  getTitlesList() {
    return this.http.get(`${this.API_URL}/titles`, this.header);
  }

}
