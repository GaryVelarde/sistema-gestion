import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { IStudent } from '../../cross-interfaces/comments-interfaces';
import { finalize, Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';
import { FileListComponent } from '../../cross-components/file-list/file-list.component';
import { UploadArchivesComponent } from '../../cross-components/upload-archives/upload-archives.component';

@Component({
  selector: 'app-hotbed-tracking',
  templateUrl: './hotbed-tracking.component.html',
  styleUrls: ['./hotbed-tracking.component.scss'],
  providers: [MessageService],
})
export class HotbedTrackingComponent implements OnInit, OnDestroy {
  @ViewChild('upload') upload: UploadArchivesComponent;
  @ViewChild('fileList') fileList: FileListComponent;
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
  dialogIndexed = false;
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
  studentsList = [];
  studentsForm: FormGroup;
  titleForm: FormGroup;
  editForm: FormGroup;
  private _title: FormControl = new FormControl('', [Validators.required]);
  private _group: FormControl = new FormControl('', [Validators.required]);
  private _students = new FormControl([], [Validators.required])
  get students() {
    return this._students;
  }
  get title() {
    return this._title;
  }
  get group() {
    return this._group;
  }

  constructor(private router: Router, private service: AuthService, private loaderService: LoaderService,
    private fb: FormBuilder, private messageService: MessageService,
  ) {
    this.studentsForm = this.fb.group({
      students: this.students,
    });
    this.titleForm = this.fb.group({
      title: this.title,
    });
    this.editForm = this.fb.group({
      group: this.group,
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
    this.fillDataInEditForm();
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
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

  backList() {
    this.loaderService.show();
    this.viewDetail = false;
    this.articleSelected = {};
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  backToDetail() {
    this.loaderService.show();
    this.viewDetail = true;
    this.viewHistory = false;
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  goToHistory() {
    this.loaderService.show();
    this.viewHistory = true;
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  getUserSelected(userSelected: any) {
    console.log('userSelected', userSelected)
    this.students.setValue(userSelected);
  }

  showEdition() {
    this.fillDataInEditForm();
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

  showDialogAddFile() {
    this.clearFile();
    this.upload.clearFile();
    this.showDialogAddFiles = true;
  }

  saveFiles() {
    this.loaderService.show(true);
    this.showDialogAddFiles = false;
    this.service.postRegisterHotbedFile(this.formData, this.articleSelected.id).pipe(
      finalize(() => {
        this.upload.clearFile()
        this.loaderService.hide();
      })
    ).subscribe(
      (res: any) => {
        if (res.status) {
          this.fileList.callGetFileList();
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

  fillDataInEditForm(): void {
    this.title.setValue(this.articleSelected.title);
    this.group.setValue(this.articleSelected.group);
  }

  callPutArticleUpdate() {
    this.loaderService.show(true);
    const request = {
      title: this.title.value,
      group: this.group.value,
      user_ids: this.extractIds(this.students.value)
    }
    this.service.putArticleUpdate(request, this.articleSelected.id).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe(
        (res: any) => {
          this.articleSelectedUpdate();
          this.edition = false;
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'Los datos han sido actualizados.',
            life: 3000,
          });
        }, (error) => {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'Se ha producido un error al guardar la información.',
            life: 3000,
          });
        })
  }

  extractIds(arr: Array<{ id: string }>): string[] {
    return arr.map(item => item.id);
  }

  saveEdition() {
    this.callPutArticleUpdate();
  }

  articleSelectedUpdate() {
    this.articleSelected.title = this.title.value;
    this.articleSelected.group = this.group.value;
    this.articleSelected.seedbeds = this.students.value;
  }

  statusUpdate(status: string) {
    this.loaderService.show();
    const request = {
      status: status
    }
    this.service.putArticleStatusUpdate(request, this.articleSelected.id).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.articleState = status;
        }
      }, (error) => {

      })
  }

  goToIndexed() {
    this.dialogIndexed = true;
  }

}
