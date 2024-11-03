import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_URL = environment.apiURL;
  header = {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  }
  constructor(private http: HttpClient) { }

  getUserById(userId: string) {
    return this.http.get(`${this.API_URL}/users/${userId}`, this.header);
  }

  putUserUpdate(request: any, userId: string) {
    return this.http.put(`${this.API_URL}/users/${userId}`, request, this.header);
  }

  postResetPassword(request: any, userId: string) {
    return this.http.post(`${this.API_URL}/users/${userId}/reset`, request, this.header);
  }
  
}
