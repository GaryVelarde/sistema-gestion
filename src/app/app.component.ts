import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { LoaderService } from './layout/service/loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private router: Router, private loaderService: LoaderService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
              this.loaderService.show();
            } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
              setTimeout(() => {
                this.loaderService.hide();
              }, 800);
            }
          });
    }
}
