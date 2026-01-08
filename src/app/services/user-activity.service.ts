import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { allowedUrlsByAuth } from '../commons/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private inactivityTimeout: any;
  private alertTimeout: any;
  private inactivityCallback!: () => void;
  private alertCallback!: () => void;
  private allowedUrls: string[] = allowedUrlsByAuth;
  private userActivitySubscription!: Subscription;

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkRouteAndResetTimer();
      });
  }

  setInactivityCallback(callback: () => void) {
    this.inactivityCallback = callback;
    this.listenForUserActivity();
  }

  setAlertCallback(callback: () => void) {
    this.alertCallback = callback;
  }

  listenForUserActivity() {
    const userActivity$: Observable<any> = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll')
    );

    this.userActivitySubscription = userActivity$.subscribe(() => {
      this.resetInactivityTimer();
    });

    this.resetInactivityTimer(); // Inicia el contador la primera vez
  }

  resetInactivityTimer() {
    if (this.shouldSkipInactivityTimer()) {
      clearTimeout(this.inactivityTimeout); // Limpiar cualquier temporizador existente
      return; // No iniciar el temporizador si la URL está en la lista permitida
    }

    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      if (this.inactivityCallback) {
        this.inactivityCallback();
      }
    }, 600_000); // Tiempo de inactividad antes de abrir el modal
  }

  startAlertTimer() {
    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => {
      if (this.alertCallback) {
        this.alertCallback();
      }
    }, 600_000); // Tiempo del segundo temporizador (dentro del modal)
  }

  shouldSkipInactivityTimer(): boolean {
    const currentUrl = this.router.url;
    return this.allowedUrls.includes(currentUrl); // Verifica si la URL actual está en la lista
  }

  checkRouteAndResetTimer() {
    if (!this.shouldSkipInactivityTimer()) {
      this.resetInactivityTimer(); // Reinicia el temporizador si no es una URL excluida
    } else {
      clearTimeout(this.inactivityTimeout); // Detiene el temporizador si la ruta está excluida
    }
  }

  stopListeningForUserActivity() {
    if (this.userActivitySubscription) {
      this.userActivitySubscription.unsubscribe();
    }
  }

  restartInactivityTimer() {
    this.resetInactivityTimer();
  }
}