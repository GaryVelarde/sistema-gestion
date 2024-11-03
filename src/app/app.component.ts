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
  displayModal: boolean = false;
  remainingTime: number = 0;
  private alertSubscription!: Subscription;
  private alertTimerStarted: boolean = false;

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
      this.startAlertCountdown();
      this.alertTimerStarted = true;
    }
  }

  hideModal() {
    this.displayModal = false;
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
    }
    this.alertTimerStarted = false;
  }

  keepConnected() {
    this.userActivityService.restartInactivityTimer();
    this.hideModal();
  }

  startAlertCountdown() {
    this.remainingTime = 60;

    this.alertSubscription = interval(1000).subscribe(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        this.alertSubscription.unsubscribe();
        this.showAlert();
      }
    });
  }

  showAlert() {
    this.logOut();
  }

  ngOnDestroy() {
    this.userActivityService.stopListeningForUserActivity();
    if (this.alertSubscription) {
      this.alertSubscription.unsubscribe();
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
    const currentUrl = this.router.url.split('?')[0];
    console.log('currentUrl', currentUrl)
    console.log('!allowedUrlsByAuth.includes(currentUrl)', allowedUrlsByAuth.includes(currentUrl))
    if (!allowedUrlsByAuth.includes(currentUrl)) {
      const userName = this.tokenService.getDR2LP2();
      if (userName === null) {
        this.router.navigate(['/auth/log-out']);
      }
    }

  }
}
