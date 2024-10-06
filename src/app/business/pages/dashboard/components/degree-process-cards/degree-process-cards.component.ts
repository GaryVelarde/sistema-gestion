import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-degree-process-cards',
  templateUrl: './degree-process-cards.component.html',
  styleUrls: ['./degree-process-cards.component.css']
})
export class DegreeProcessCardsComponent implements OnInit, OnDestroy {
  statusGet = '';
  data = [];
  private destroy$ = new Subject<void>();

  constructor(private service: AuthService) { }

  ngOnInit() {
    this.callgetCounterReport();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callgetCounterReport() {
    this.statusGet = 'charging';
    this.service.getCounterReport().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      console.log('getCounterReportr', res);
      if (res.data) {
        this.data = res.data;
        this.statusGet = 'complete';
      }
    }, (error) => {
      this.statusGet = 'error';
    })
  }

}
