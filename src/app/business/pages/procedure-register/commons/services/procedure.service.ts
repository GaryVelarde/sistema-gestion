import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedureRegisterService {
  private readonly API_URL = environment.apiURL;
  header = {
    headers: {
      'ngrok-skip-browser-warning': 'true'
    }
  }
  constructor(private http: HttpClient) { }

  postRegisterProcedure(request: any) {
    return this.http.post(`${this.API_URL}/procedure`, request, this.header);
  }

  postRegisterProcedureFile(request: any, id: string) {
    return this.http.post(`${this.API_URL}/procedure/${id}/archive`, request, this.header);
  }

  getProcedureTypesList(): Observable<any> {
    return this.http.get(`${this.API_URL}/procedure-type`, this.header);
  }
}
