import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hotbed-tracking',
  templateUrl: './hotbed-tracking.component.html',
  styleUrls: ['./hotbed-tracking.component.scss'],
  providers: [MessageService],
})
export class HotbedTrackingComponent implements OnInit {
  registros: [
    {
      "id": 1,
      "title": "Titulo de prueba",
      "group": 3,
      "created_at": "27-08-2024 21:07:11",
      "seedbeds": [
        {
          "id": 6,
          "name": "Rodrigo Cepeda Anguiano",
          "surnames": "Lovato",
          "email": "mgranados@example.com",
          "phone": 399570148,
          "code": 28681077,
          "cycle": "X"
        }
      ]
    }
  ]
  hotbedSelected = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToRegisterHotbed() {
    this.router.navigate(['pages/registrar-semilleros']);
  }

}
