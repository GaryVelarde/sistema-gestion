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
  events = [
    { status: 'En desarrollo', date: '15-10-2020 10:30', icon: 'pi pi-pencil', color: '#6366f1', message: 'El artículo pasó a desarrollo el día ' },
    { status: 'Revisado', date: '15-10-2020 14:00', icon: 'pi pi-check', color: '#6366f1' },
    { status: 'Envió a revista ', date: '15-10-2020 16:15', icon: 'pi pi-sign-in', color: '#6366f1' },
    { status: 'Indexado', date: '00-00-0000 00:00', icon: 'pi pi-paperclip', color: '#607D8B' },
    { status: 'Pagado', date: '00-00-0000 00:00', icon: 'pi pi-wallet', color: '#607D8B' }
];

  viewDetail = false;
  viewHistory = false;
  articleSelected: any;
  getArticleListProcess = '';
  skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
  messageError: string = 'Se produjo un error al cargar la lista de artículos. Por favor, inténtelo de nuevo más tarde';

  constructor(private router: Router, private service: AuthService, private loaderService: LoaderService) { }

  ngOnInit() {
    this.getArticleList();
  }

  goToRegisterHotbed() {
    this.router.navigate(['pages/registrar-semilleros']);
  }

  viewDetailsHotbed(data: any) {
    this.loaderService.show();
    this.viewDetail = true;
    this.articleSelected = data;
    console.log(this.articleSelected);
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
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

  test() {
    this.registros =[
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
    ];
    this.getArticleListProcess = 'complete';
  }

  backList() {
    this.loaderService.show();
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
    this.viewDetail = false;
    this.articleSelected = {};
  }
}
