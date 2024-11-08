import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { FileListComponent } from '../../cross-components/file-list/file-list.component';
import { UploadArchivesComponent } from '../../cross-components/upload-archives/upload-archives.component';
import { DateFormatService } from 'src/app/services/date-format.service';
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-guide-tracking',
  templateUrl: './guide-tracking.component.html',
  styleUrls: ['./guide-tracking.component.scss'],
  providers: [MessageService],
})
export class GuideTrackingComponent implements OnInit, OnDestroy {
  @ViewChild('upload') upload: UploadArchivesComponent;
  @ViewChild('fileList') fileList: FileListComponent;
  @ViewChild('reviewerSelection') reviewerSelection: UserSelectionComponent;

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
    { label: 'Líneas y Guías', visible: true },
  ];
  detailsBreadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Semillero' },
    { label: 'Líneas y Guías' },
    { label: 'Detalle', visible: true },
  ];
  private destroy$ = new Subject<void>();
  viewDetail = false;
  showDialogAddFiles = false;
  module = eModule.guide;
  reviewerType = userType.teacherAndUdi;
  guideSelected: any;
  getListProcess = '';
  skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
  columnTitles: string[] = [
    'Título',
    'Docente(s)',
    'Estado',
    ''
  ];
  isUdi = this.tokenService.userIsUDI();
  formData = new FormData();
  messageError: string = 'Se produjo un error al cargar la lista de líneas y guías. Por favor, inténtelo de nuevo más tarde';
  edition = false;
  lastTeachersSelected = [];
  guideState: string;
  teacherForm: FormGroup;
  titleForm: FormGroup;
  editForm: FormGroup;
  indexedForm: FormGroup;
  private _title: FormControl = new FormControl('', [Validators.required]);
  private _description: FormControl = new FormControl('', [Validators.required]);
  private _journalName: FormControl = new FormControl('', [Validators.required]);
  private _publicationDate: FormControl = new FormControl('', [Validators.required]);
  private _volume: FormControl = new FormControl('', [Validators.required]);
  private _teachers = new FormControl([], [Validators.required])
  get teachers() {
    return this._teachers;
  }
  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get journalName() {
    return this._journalName;
  }
  get publicationDate() {
    return this._publicationDate;
  }
  get volume() {
    return this._volume;
  }

  constructor(
    private router: Router,
    private service: AuthService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private dateFormatService: DateFormatService,
    private tokenService: TokenService,
  ) {
    this.teacherForm = this.fb.group({
      teachers: this.teachers,
    });
    this.titleForm = this.fb.group({
      title: this.title,
    });
    this.editForm = this.fb.group({
      description: this.description,
    });
    this.indexedForm = this.fb.group({
      journalName: this.journalName,
      publicationDate: this.publicationDate,
      volume: this.volume,
    });
  }

  ngOnInit() {
    this.getGuideList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearValues();
  }

  clearValues() {
    this.indexedForm.reset();
    this.viewDetail = false;
    this.guideSelected = {};
  }

  goToRegisterGuide() {
    this.router.navigate(['pages/lineas-guias-registro']);
  }

  viewDetailsGuide(data: any) {
    this.loaderService.show();
    this.viewDetail = true;
    this.guideSelected = data;
    this.teachers.setValue(data.teachers);
    this.guideState = data.status;
    this.fillDataInEditForm();
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  getGuideList() {
    this.getListProcess = 'charging';
    this.service.getGuides().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.registros = res.data;
        this.getListProcess = 'complete';
      }
    },
      (error) => {
        this.getListProcess = 'error';
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
      this.getGuideList();
    }
  }

  backList() {
    this.loaderService.show();
    this.viewDetail = false;
    this.guideSelected = {};
    this.getGuideList();
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  backToDetail() {
    this.loaderService.show();
    this.viewDetail = true;
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  getUserSelected(userSelected: any) {
    this.teachers.setValue(userSelected);
  }

  showEdition() {
    this.fillDataInEditForm();
    this.lastTeachersSelected = this.teachers.value;
    this.edition = true;
  }

  cancelEdition() {
    this.teachers.setValue(this.lastTeachersSelected);
    this.reviewerSelection.userFormControl.setValue(this.lastTeachersSelected);
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
    this.service.postRegisterGuideFile(this.formData, this.guideSelected.id).pipe(
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
    this.title.setValue(this.guideSelected.title);
    this.description.setValue(this.guideSelected.description);
  }

  callPutGuideUpdate() {
    this.loaderService.show(true);
    const request = {
      title: this.title.value,
      description: this.description.value,
      user_ids: this.extractIds(this.teachers.value)
    }
    this.service.putGuideUpdate(this.guideSelected.id, request).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe(
        (res: any) => {
          this.guideSelectedUpdate();
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
    this.callPutGuideUpdate();
  }

  guideSelectedUpdate() {
    this.guideSelected.title = this.title.value;
    this.guideSelected.description = this.description.value;
    this.guideSelected.teachers = this.teachers.value;
  }

  statusUpdate(status: string) {
    this.loaderService.show();
    const request = {
      status: status
    }
    this.service.putGuideStatusUpdate(this.guideSelected.id, request).pipe(
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.guideState = status;
        }
      }, (error) => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se ha producido un error al actualizar el estado.',
          life: 3000,
        });
      })
  }

}
