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
    return this.http.post(`${this.API_URL}/login`, credentials);
  }

  postInscription(rq: any): Observable<any> {
    return this.http.post(`${this.API_URL}/inscription`, rq);
  }

  getInscription(): Observable<any> {
    return this.http.get(`${this.API_URL}/inscription`);
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

  addTask(reunionId: string, request: any) {
    return this.http.post(`${this.API_URL}/meeting/${reunionId}/task`, request, this.header);
  }

  postRegisterArticle(request: any) {
    return this.http.post(`${this.API_URL}/article`, request, this.header);
  }

  postRegisterArticleFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/article/${id}/archive`, request, this.header);
  }



}
