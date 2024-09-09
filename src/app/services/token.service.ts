import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  handleToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getDR2LP2(): any | null {
    return JSON.parse(localStorage.getItem('dr2lp2'));
  }

  revokeToken(): void {
    localStorage.removeItem('access_token');
  }

  revokeDR2LP2(): void {
    localStorage.removeItem('dr2lp2');
  }

  isAuthenticated(): boolean {
    if (this.getToken())
      return true;

    return false;
  }
}
