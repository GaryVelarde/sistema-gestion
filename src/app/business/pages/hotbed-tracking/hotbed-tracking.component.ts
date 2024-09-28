import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { IStudent } from '../../cross-interfaces/comments-interfaces';
import { finalize, Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';

@Component({
  selector: 'app-hotbed-tracking',
  templateUrl: './hotbed-tracking.component.html',
  styleUrls: ['./hotbed-tracking.component.scss'],
  providers: [MessageService],
})
export class HotbedTrackingComponent implements OnInit, OnDestroy {

  registros = [];
  events = [
    { status: 'En desarrollo', date: '15-10-2020 10:30', icon: 'pi pi-pencil', color: '#6366f1', message: 'El artículo pasó a desarrollo el día ' },
    { status: 'Revisado', date: '15-10-2020 14:00', icon: 'pi pi-check', color: '#6366f1' },
    { status: 'Envió a revista ', date: '15-10-2020 16:15', icon: 'pi pi-sign-in', color: '#6366f1' },
    { status: 'Indexado', date: '00-00-0000 00:00', icon: 'pi pi-paperclip', color: '#607D8B' },
    { status: 'Pagado', date: '00-00-0000 00:00', icon: 'pi pi-wallet', color: '#607D8B' }
  ];

  breadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Semillero' },
    { label: 'Artículos', visible: true },
  ];
  detailsBreadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Semillero' },
    { label: 'Artículos' },
    { label: 'Detalle del artículo', visible: true },
  ];
  timeLineBreadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Semillero' },
    { label: 'Artículos' },
    { label: 'Detalle del artículo' },
    { label: 'Línea de tiempo', visible: true },
  ];
  private destroy$ = new Subject<void>();
  viewDetail = false;
  viewHistory = false;
  showDialogAddFiles = false;
  reloadFiles = false;
  module = eModule.hotbed;
  articleSelected: any;
  getArticleListProcess = '';
  skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
  columnTitles: string[] = [
    'Título del artículo',
    'Estudiante(s)',
    'Estado',
    ''
  ];
  formData = new FormData();
  messageError: string = 'Se produjo un error al cargar la lista de artículos. Por favor, inténtelo de nuevo más tarde';
  edition = false;
  articleState: string;
  studentsForm: FormGroup;
  studentsList = [];
  private _students = new FormControl([] as IStudent[], [Validators.required])
  get students() {
    return this._students;
  }

  constructor(private router: Router, private service: AuthService, private loaderService: LoaderService,
    private fb: FormBuilder, private messageService: MessageService,
  ) {
    this.studentsForm = this.fb.group({
      students: this.students,
    });
  }

  ngOnInit() {
    this.getArticleList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToRegisterHotbed() {
    this.router.navigate(['pages/registrar-semilleros']);
  }

  viewDetailsHotbed(data: any) {
    this.loaderService.show();
    this.viewDetail = true;
    this.articleSelected = data;
    this.studentsList = data.seedbeds;
    this.articleState = data.status;
    console.log(this.articleSelected);
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
  }

  getArticleList() {

    this.getArticleListProcess = 'charging';
    this.service.getArticleList().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.registros = res.data;
        this.getArticleListProcess = 'complete';
      }
    },
      (error) => {
        this.getArticleListProcess = 'error';
      })
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }

  handleReload(reload: boolean) {
    if (reload) {
      this.getArticleList();
    }
  }

  test() {
    this.registros = [
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
    this.viewDetail = false;
    this.articleSelected = {};
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
  }

  backToDetail() {
    this.loaderService.show();
    this.viewDetail = true;
    this.viewHistory = false;
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
  }

  goToHistory() {
    this.loaderService.show();
    this.viewHistory = true;
    setTimeout(() => {
      this.loaderService.hide();
    }, 800);
  }

  getUserSelected(userSelected: any) {
    console.log('userSelected', userSelected)
    this.students.setValue(userSelected);
  }

  showEdition() {
    this.edition = true;
  }

  cancelEdition() {
    this.edition = false;
  }

  onFileChange(files: any) {
    this.formData = files;
}

clearFile() {
    this.formData = new FormData();
}

hideAddFilesDialog() {
    this.clearFile();
    this.showDialogAddFiles = false;
}

saveFiles() {
    this.loaderService.show();
    this.showDialogAddFiles = false;
    this.service.postRegisterHotbedFile(this.formData, this.articleSelected.id).pipe(
        finalize(() => {
            this.loaderService.hide();
        })
    ).subscribe(
        (res: any) => {
            if (res.status) {
                this.reloadFiles = true;
                this.hideAddFilesDialog();
                this.messageService.add({
                    key: 'tst',
                    severity: 'info',
                    summary: 'Confirmación',
                    detail: 'Los archivos han sido guardados.',
                    life: 3000,
                });
            }
        }, (error) => {
            this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error',
                detail: 'Se ha producido un error al guardar los archivos.',
                life: 3000,
            });
        });
}

isFormDataEmpty(formData: FormData): boolean {
    return !(formData as any).entries().next().done;
}
}
