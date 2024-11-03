import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  private readonly API_URL = environment.apiURL;
  header = {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  }
  constructor(private http: HttpClient) { }

  getProcedureList(): Observable<any> {
    return this.http.get(`${this.API_URL}/procedure`, this.header);
  }

  getProcedureTypesList(): Observable<any> {
    return this.http.get(`${this.API_URL}/allprocedure-types`, this.header);
  }

  postRegisterProcedureFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/procedure/${id}/archive`, request, this.header);
  }

  postRegisterProcedureType(request: any) {
    return this.http.post(`${this.API_URL}/procedure-type`, request, this.header);
  }

  putProcedureStatusUpdate(request: any, id: string) {
    return this.http.put(`${this.API_URL}/procedure/${id}/status`, request, this.header);
  }
}
