import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { eModule, userType } from 'src/app/commons/enums/app,enum';
import { FileListComponent } from '../../cross-components/file-list/file-list.component';
import { UploadArchivesComponent } from '../../cross-components/upload-archives/upload-archives.component';
import { DateFormatService } from 'src/app/services/date-format.service';
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';
import { ProcedureService } from './commons/services/procedure.service';

@Component({
  selector: 'app-guide-tracking',
  templateUrl: './procedure-tracking.component.html',
  styleUrls: ['./procedure-tracking.component.scss'],
  providers: [MessageService],
})
export class ProcedureTrackingComponent implements OnInit, OnDestroy {
  @ViewChild('upload') upload: UploadArchivesComponent;
  @ViewChild('fileList') fileList: FileListComponent;
  @ViewChild('reviewerSelection') reviewerSelection: UserSelectionComponent;

  registros = [];
  types = [];

  breadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Trámites' },
    { label: 'Lista de trámites', visible: true },
  ];
  detailsBreadcrumbItems: MenuItem[] = [
    { icon: 'pi pi-home', route: '/' },
    { label: 'Trámites' },
    { label: 'Lista de trámites' },
    { label: 'Detalle', visible: true },
  ];
  private destroy$ = new Subject<void>();
  viewDetail = false;
  showDialogAddFiles = false;
  showDialogProcedureType = false;
  module = eModule.procedure;
  reviewerType = userType.student;
  procedureSelected: any;
  getListProcess = '';
  getTypeListProcess = '';
  newProcedureText = '';
  statusProcedureTypeSave = 'pi pi-save';
  statusProcedureTypeDelete = 'pi pi-trash';
  statusProcedureTypeAdd = 'pi pi-plus';
  skeletonRows = Array.from({ length: 10 }).map((_, i) => `Item #${i}`);
  columnTitles: string[] = [
    'Trámite',
    'Descripción',
    'Solicitante',
    ''
  ];
  formData = new FormData();
  messageError: string = 'Se produjo un error al cargar la lista de artículos. Por favor, inténtelo de nuevo más tarde';
  edition = false;
  lastStudentSelected = [];
  procedureState: string;
  studentForm: FormGroup;
  editForm: FormGroup;
  private _description: FormControl = new FormControl('', [Validators.required]);
  private _student = new FormControl([], [Validators.required])
  private _procedureType = new FormControl({} as any, [Validators.required])

  get student() {
    return this._student;
  }
  get description() {
    return this._description;
  }
  get procedureType() {
    return this._procedureType;
  }

  constructor(
    private router: Router,
    private service: ProcedureService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.studentForm = this.fb.group({
      teachers: this.student,
    });
    this.editForm = this.fb.group({
      description: this.description,
      procedureType: this.procedureType,
    });
  }

  ngOnInit() {
    this.getProcedureList();
    this.getProcedureTypesList();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearValues();
  }

  clearValues() {
    this.viewDetail = false;
    this.procedureSelected = {};
  }

  goToRegisterProcedure() {
    this.router.navigate(['pages/registro-tramites']);
  }

  viewDetailsGuide(data: any) {
    this.loaderService.show();
    this.viewDetail = true;
    this.edition = false;
    this.procedureSelected = data;
    console.log('procedureSelected', this.procedureSelected);
    this.student.setValue([data.applicant]);
    this.procedureState = data.status;
    this.fillDataInEditForm();
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  getProcedureList() {
    this.getListProcess = 'charging';
    this.service.getProcedureList().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.registros = res.data;
        this.getListProcess = 'complete';
      }
    },
      (error) => {
        this.getListProcess = 'error';
      })
  }

  getProcedureTypesList() {
    this.getTypeListProcess = 'charging';
    this.service.getProcedureTypesList().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.types = res.data;
        this.statusProcedureTypeDelete = 'pi pi-trash';
        this.statusProcedureTypeAdd = 'pi pi-plus'
        this.getTypeListProcess = 'complete';
      }
    },
      (error) => {
        this.getTypeListProcess = 'error';
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
      this.getProcedureList();
    }
  }

  backList() {
    this.loaderService.show();
    this.viewDetail = false;
    this.edition = false;
    this.procedureSelected = {};
    this.getProcedureList();
    setTimeout(() => {
      this.loaderService.hide();
    }, 400);
  }

  getUserSelected(userSelected: any) {
    this.student.setValue(userSelected);
  }

  showEdition() {
    this.fillDataInEditForm();
    this.lastStudentSelected = this.student.value;
    this.edition = true;
  }

  cancelEdition() {
    this.student.setValue(this.lastStudentSelected);
    this.reviewerSelection.userFormControl.setValue(this.lastStudentSelected);
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
    this.service.postRegisterProcedureFile(this.formData, this.procedureSelected.id).pipe(
      takeUntil(this.destroy$),
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

  extractIds(arr: Array<{ id: string }>): string[] {
    return arr.map(item => item.id);
  }

  getIds(arr: any[]) {
    return arr.map(item => item.id);
  }

  fillDataInEditForm() {
    this.description.setValue(this.procedureSelected.description);
    this.procedureType.setValue(
      {
        id: this.procedureSelected.procedure_type_id,
        procedure_type: this.procedureSelected.procedure_type
      },);
  }

  procedureSelectedUpdate() {
    this.procedureSelected.description = this.description.value;
    console.log('this.student.value', this.student.value);
    this.procedureSelected.applicant = this.student.value;
  }

  showDialogProcedure() {
    this.showDialogProcedureType = true;
  }

  saveTypeProcedure(item: any) {
    console.log('Tipo de trámite guardado:', item.procedure_type);
    console.log('Tipo de trámite guardado:', item.id);
    this.statusProcedureTypeSave = 'pi pi-spin pi-spinner';
    const request = {
      procedure_type: item.procedure_type
    }
    this.service.putUpdateProcedureType(request, item.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.statusProcedureTypeSave = 'pi pi-save';
      })
    ).subscribe(
      (res: any) => {
        if (res.status) {
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'La información se ha guardado.',
            life: 3000,
          });
        }
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

  deleteProcedureType(item: any) {
    this.statusProcedureTypeDelete = 'pi pi-spin pi-spinner';
    this.service.deleteProcedureType(item.id).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.getProcedureTypesList();
        }
      }, (error) => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se ha producido un error al procesar la información.',
          life: 3000,
        });
      })
  }

  postRegisterProcedureType() {
    this.statusProcedureTypeAdd = 'pi pi-spin pi-spinner';
    const text = this.newProcedureText;
    if (text) {
      const request = {
        procedure_type: text
      }
      this.service.postRegisterProcedureType(request).pipe(
        takeUntil(this.destroy$)
      ).
        subscribe((res: any) => {
          if (res.status) {
            this.getProcedureTypesList();
            this.newProcedureText = '';
          }
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
  }

  statusUpdate(status: string) {
    this.loaderService.show();
    const request = {
      status: status
    }
    this.service.putProcedureStatusUpdate(request, this.procedureSelected.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.procedureState = status;
        }
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

  saveEdition() {
    this.procedureUpdate();
  }

  procedureUpdate() {
    this.loaderService.show(true);
    const request = {
      procedure_type_id: this.getIds([this.procedureType.value])[0],
      user_id: this.getIds(this.student.value)[0],
      description: this.description.value
    }
    this.service.putProcedureUpdate(request, this.procedureSelected.id).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.loaderService.hide();
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.edition = false;
          this.confirmProcedureUpdate();
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'La información se ha guardado.',
            life: 3000,
          });
        }
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

  confirmProcedureUpdate() {
    this.procedureSelected.description = this.description.value;
    this.procedureSelected.procedure_type = this.procedureType.value.procedure_type;
    this.procedureSelected.procedure_type_id = this.procedureType.value.id;
  }
}
