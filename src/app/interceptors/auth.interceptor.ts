import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private router: Router) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

  //   if (this.tokenService.isAuthenticated()) {
  //     const token = this.tokenService.getToken();
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //   }

  //   return next.handle(request);
  // }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.tokenService.isAuthenticated()) {
      const token = this.tokenService.getToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el status es 401 y el mensaje es "Unauthenticated."
        if (error.status === 401 && error.error.message === 'Unauthenticated.') {
          // Redirige al login
          console.log('aaaaaaaaaaaa')
          this.router.navigate(['./auth/log-out']);
        }
        // Retorna el error para manejarlo más adelante si es necesario
        return throwError(error);
      })
    );
  }

}
