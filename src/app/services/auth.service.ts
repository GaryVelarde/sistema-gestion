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

  updateTaskDetail(reunionId: string, taskId: string, request: any) {
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
    return this.http.get(`${this.API_URL}/meeting/${id}/observations`, this.header);
  }

  getCommentsByHotbed(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/article/${id}/observations`, this.header);
  }

  getAdvisoryList(): Observable<any> {
    return this.http.get(`${this.API_URL}/advisory`, this.header);
  }

  putUser(id: string, request: any) {
    return this.http.put(`${this.API_URL}/users/${id}`, request, this.header);
  }

  putInscriptionStatusUpdate(id: string, request: any) {
    return this.http.put(`${this.API_URL}/inscription/${id}/status`, request, this.header);
  }

  postAddInscriptionComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/inscription/${id}/observations`, request, this.header);
  }

  postAddEventsUdiComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/meeting/${id}/observations`, request, this.header);
  }

  postAddAdvisoryComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/advisory/${id}/observations`, request, this.header);
  }

  postAddHotbedComment(id: any, request: any) {
    return this.http.post(`${this.API_URL}/article/${id}/observations`, request, this.header);
  }

  closeSession() {
    return this.http.delete(`${this.API_URL}/logout`, this.header);
  }

  getEventsUdiList() {
    return this.http.get(`${this.API_URL}/meeting`, this.header);
  }

  putAdvisoryUpdate(id: string, request: any) {
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

  postAddAdvisoryTask(id: string, request: any) {
    return this.http.post(`${this.API_URL}/advisory/${id}/tasks`, request, this.header);
  }

  getTitlesList() {
    return this.http.get(`${this.API_URL}/titles`, this.header);
  }

  getArticlesTitlesList() {
    return this.http.get(`${this.API_URL}/title-articles`, this.header);
  }

  postRegisterIncriptionFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/inscription/${id}/archive`, request, this.header);
  }

  putAdvisoryStatusUpdate(id: string, request: any) {
    return this.http.put(`${this.API_URL}/advisory/${id}/status`, request, this.header);
  }

  getAdvisoryFiles(id: string) {
    return this.http.get(`${this.API_URL}/advisory/${id}/archive`, this.header);
  }

  putAdvisoryTaskStatusUpdate(request: any, idAdvisory: string, idTask: string) {
    return this.http.put(`${this.API_URL}/advisory/${idAdvisory}/tasks/${idTask}`, request, this.header);
  }

  getInscriptionFiles(id: string) {
    return this.http.get(`${this.API_URL}/inscription/${id}/archive`, this.header);
  }

  postRegisterAdvisoryFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/advisory/${id}/archive`, request, this.header);
  }

  getHotbedFiles(id: string) {
    return this.http.get(`${this.API_URL}/article/${id}/archive`, this.header);
  }

  postRegisterHotbedFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/article/${id}/archive`, request, this.header);
  }

  getThesisReviewList() {
    return this.http.get(`${this.API_URL}/review`, this.header);
  }

  postRegisterThesisReviewFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/review/${id}/archive`, request, this.header);
  }

  getThesisReviewFiles(id: string) {
    return this.http.get(`${this.API_URL}/review/${id}/archive`, this.header);
  }

  getNotificationReport() {
    return this.http.get(`${this.API_URL}/notification-report`, this.header);
  }

  postAddNewEvent(request: any) {
    return this.http.post(`${this.API_URL}/meeting`, request, this.header);
  }

  putInscriptionUpdate(id: string, request: any) {
    return this.http.put(`${this.API_URL}/inscription/${id}`, request, this.header);
  }

  getCounterReport() {
    return this.http.get(`${this.API_URL}/counter-report`, this.header);
  }

  putReviewUpdate(id: string, request: any) {
    return this.http.put(`${this.API_URL}/review/${id}`, request, this.header);
  }

  putReviewStatusUpdate(id: string, request: any) {
    return this.http.put(`${this.API_URL}/review/${id}/status`, request, this.header);
  }

  postRegisterReviewFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/review/${id}/archive`, request, this.header);
  }

  getPresentationList() {
    return this.http.get(`${this.API_URL}/presentation`, this.header);
  }

  getInscriptionMonthlyReport(year: string) {
    return this.http.get(`${this.API_URL}/monthly-inscriptions/${year}`, this.header);
  }

  getAdvisoryMonthlyReport(year: string) {
    return this.http.get(`${this.API_URL}/monthly-advisories/${year}`, this.header);
  }

  getReviewsMonthlyReport(year: string) {
    return this.http.get(`${this.API_URL}/monthly-reviews/${year}`, this.header);
  }

  getPresentationMonthlyReport(year: string) {
    return this.http.get(`${this.API_URL}/monthly-presentations/${year}`, this.header);
  }

  getArticlesMonthlyReport(year: string) {
    return this.http.get(`${this.API_URL}/monthly-articles/${year}`, this.header);
  }

  putPresentationUpdate(presentationId: string, request: any) {
    return this.http.put(`${this.API_URL}/presentation/${presentationId}`, request, this.header);
  }

  putPresentationUpdateStatus(presentationId: string, request: any) {
    return this.http.put(`${this.API_URL}/presentation/${presentationId}/status`, request, this.header);
  }

  postPlanRegister(request: any) {
    return this.http.post(`${this.API_URL}/plan`, request, this.header);
  }

  getPlans() {
    return this.http.get(`${this.API_URL}/plan`, this.header);
  }

  putPlansUpdate(planId: string, request: any) {
    return this.http.put(`${this.API_URL}/plan/${planId}`, request, this.header);
  }

}
