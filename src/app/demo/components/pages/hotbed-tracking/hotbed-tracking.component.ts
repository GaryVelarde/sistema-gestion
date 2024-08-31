import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hotbed-tracking',
  templateUrl: './hotbed-tracking.component.html',
  styleUrls: ['./hotbed-tracking.component.scss'],
  providers: [MessageService],
})
export class HotbedTrackingComponent implements OnInit {

  registros = [];/*[
    {
      "id": 1,
      "title": "Titulo de prueba",
      "group": 3,
      "created_at": "27-08-2024 21:07:11",
      "seedbeds": [
        {
          "id": 6,
          "name": "Rodrigo Cepeda",
          "surnames": "Lovato",
          "email": "mgranados@example.com",
          "phone": 399570148,
          "code": 28681077,
          "cycle": "X"
        }
      ]
    },
    {
      "id": 2,
      "title": "Titulo de prueba 2",
      "group": 3,
      "created_at": "27-08-2024 21:07:11",
      "seedbeds": [
        {
          "id": 6,
          "name": "Cesar Antonio",
          "surnames": "Jauregui Saavedra",
          "email": "mgranados@example.com",
          "phone": 399570148,
          "code": 28681077,
          "cycle": "X"
        },
        {
          "id": 6,
          "name": "Gary Isaac",
          "surnames": "Velarde Rios",
          "email": "mgranados@example.com",
          "phone": 399570148,
          "code": 28681077,
          "cycle": "X"
        }
      ]
    }
  ];*/
  viewDetail = false;
  articleSelected: any;
  getArticleListProcess = '';
  skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
  messageError: string = 'Se produjo un error al cargar la lista de artículos. Por favor, inténtelo de nuevo más tarde';

  constructor(private router: Router, private service: AuthService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.getArticleList();
    this.loaderService.hide();
  }

  goToRegisterHotbed() {
    this.router.navigate(['pages/registrar-semilleros']);
  }

  viewDetailsHotbed(data: any) {
    this.viewDetail = true;
    this.articleSelected = data;
    console.log(this.articleSelected)
  }

  getArticleList() {

    this.getArticleListProcess = 'charging';
    this.service.getArticleList().pipe().subscribe((res: any) => {
      if (res) {
        this.registros = res.data;
        this.getArticleListProcess = 'complete';
      }
    },
      (error) => {
        // Handle the error in the subscription if necessary
        this.getArticleListProcess = 'error';
        console.log('Error in subscription:', error);
      })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }

  handleReload(reload: boolean) {
    if(reload){
      this.getArticleList();
    }
  }
}
