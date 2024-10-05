import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { LoaderService } from './layout/service/loader.service';
import { UserActivityService } from './services/user-activity.service';
import { interval, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { allowedUrlsByAuth } from './commons/constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  displayModal: boolean = false; // Controla la visibilidad del modal
  remainingTime: number = 0; // Tiempo restante del temporizador en segundos
  private alertSubscription!: Subscription;
  private alertTimerStarted: boolean = false; // Flag para evitar múltiples inicios del temporizador de alerta

  constructor(private primengConfig: PrimeNGConfig, private router: Router, private loaderService: LoaderService,
    private userActivityService: UserActivityService, private service: AuthService, private tokenService: TokenService
  ) {
    this.secondValidatonByDataLocalStorage();
    this.userActivityService.setInactivityCallback(() => this.showModal());
    this.userActivityService.setAlertCallback(() => this.showAlert());
  }

  showModal() {
    this.displayModal = true;
    if (!this.alertTimerStarted) {
      this.startAlertCountdown(); // Inicia el temporizador de cuenta regresiva
      this.alertTimerStarted = true; // Marca el temporizador como iniciado
    }
  }

  hideModal() {
    this.displayModal = false;
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe(); // Detiene la cuenta regresiva cuando se cierra el modal
    }
    this.alertTimerStarted = false; // Reinicia el flag al cerrar el modal
  }

  keepConnected() {
    this.userActivityService.restartInactivityTimer(); // Reinicia el temporizador de inactividad
    this.hideModal(); // Cierra el modal
  }

  startAlertCountdown() {
    this.remainingTime = 60; // Tiempo inicial en segundos

    this.alertSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.alertSubscription.unsubscribe();
        this.showAlert(); // Muestra la alerta cuando termina la cuenta regresiva
      }
    });
  }

  showAlert() {
    this.logOut();
  }

  ngOnDestroy() {
    this.userActivityService.stopListeningForUserActivity();
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe(); // Limpia la suscripción al destruir el componente
    }
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          this.secondValidatonByDataLocalStorage()
          this.loaderService.hide();
        }, 400);
      }
    });
  }

  logOut() {
    this.hideModal();
    this.service.closeSession().pipe().subscribe(
      (res) => {
        this.tokenService.revokeDR2LP2();
        this.tokenService.revokeToken();
      }, (error) => {
        this.tokenService.revokeDR2LP2();
        this.tokenService.revokeToken();
      });
    this.router.navigate(['/auth/log-out']);
  }

  secondValidatonByDataLocalStorage() {
    const currentUrl = this.router.url;
    if (!allowedUrlsByAuth.includes(currentUrl)) {
      const userName = this.tokenService.getDR2LP2();
      if (userName === null) {
        this.router.navigate(['/auth/log-out']);
      }
    }

  }
}
