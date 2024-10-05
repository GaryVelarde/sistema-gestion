import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private showMessageSubject = new BehaviorSubject<boolean>(false);
  showMessage$ = this.showMessageSubject.asObservable();

  show(message: boolean = false) {
    this.loadingSubject.next(true);
    this.showMessageSubject.next(message);
  }

  hide() {
    this.loadingSubject.next(false);
  }
}