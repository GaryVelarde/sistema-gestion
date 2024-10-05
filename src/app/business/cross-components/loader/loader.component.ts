// loader.component.ts
import { Component } from '@angular/core';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [ // Cuando el elemento entra en el DOM
        style({ opacity: 0 }),
        animate('10ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // Cuando el elemento sale del DOM
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoaderComponent {
  isLoading: boolean = false;
  message: boolean = false;

  constructor(private loaderService: LoaderService) {
    this.loaderService.loading$.subscribe(isLoading => {
      this.isLoading = isLoading;
      if(isLoading) {
        this.loaderService.showMessage$.subscribe(message => {
          this.message = message;
        });
      }
    });
    
  }
}