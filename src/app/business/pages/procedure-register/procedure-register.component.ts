import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';
import { IStudent } from '../../cross-interfaces/comments-interfaces';
import { ThesisSimilarityService } from 'src/app/services/thesis-similarity.service';
import { UploadArchivesComponent } from '../../cross-components/upload-archives/upload-archives.component';
import { userType } from 'src/app/commons/enums/app,enum';
import { ProcedureRegisterService } from './commons/services/procedure.service';

@Component({
  templateUrl: './procedure-register.component.html',
  styleUrls: ['./procedure-register.component.scss'],
  styles: [
    `.p-stepper {
        flex-basis: 50rem;
    } `
  ],
  providers: [MessageService, ThesisSimilarityService]

})
export class ProcedureRegisterComponent implements OnInit, OnDestroy {
  @ViewChild('userSelection') userSelection: UserSelectionComponent;
  @ViewChild('upload') upload: UploadArchivesComponent;

  userType = userType.student;
  private destroy$ = new Subject<void>();
  types = [];
  getTypeListProcess = '';
  articleForm: FormGroup;
  studentsForm: FormGroup;
  private _procedureType = new FormControl({}, [Validators.required]);
  private _description = new FormControl('', [Validators.required]);
  private _students = new FormControl([] as IStudent[], [Validators.required])

  get description() {
    return this._description;
  }
  get procedureType() {
    return this._procedureType;
  }
  get students() {
    return this._students;
  }

  reader = new FileReader();
  filesSelected = [];
  formData = new FormData();

  constructor(private fb: FormBuilder, private router: Router, private service: ProcedureRegisterService,
    private loaderService: LoaderService, private messageService: MessageService,

  ) {
    this.articleForm = this.fb.group({
      procedureType: this.procedureType,
      description: this.description
    });
    this.studentsForm = this.fb.group({
      students: this.students,
    });
  }

  ngOnInit() {
    this.getProcedureTypesList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(files: any) {
    this.formData = files;
  }

  backToList() {
    this.router.navigate(['pages/tramites']);
  }

  getProcedureTypesList() {
    this.getTypeListProcess = 'charging';
    this.service.getProcedureTypesList().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.types = res.data;
        this.getTypeListProcess = 'complete';
      }
    },
      (error) => {
        this.getTypeListProcess = 'error';
      })
  }

  nextStep() {
    this.loaderService.show(true);
    const rq = {
      procedure_type_id: this.getIds([this.procedureType.value])[0],
      description: this.description.value,
      user_id: this.getIds(this.students.value)[0]
    }
    this.service.postRegisterProcedure(rq).pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      (res: any) => {
        if (res.status) {
          this.service.postRegisterProcedureFile(this.formData, res.id).pipe(
            takeUntil(this.destroy$),
            finalize(() => {
              this.loaderService.hide();
            })
          ).subscribe(
            (res: any) => {
              if (res.status) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Se ha registrado de manera correcta.' });
                this.clearValues();
              }
            }, (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los archivos.' });
            })
        }
      },
      (error) => {
        this.loaderService.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al registrar la información.' });
      });
  }

  getFileType(fileName: string): string | null {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null;
    }
    const fileType = fileName.substring(lastDotIndex + 1).toLowerCase();
    return fileType;
  }

  clearFile() {
    this.filesSelected = [];
    this.formData = new FormData();
  }

  getIds(arr: any[]) {
    return arr.map(item => item.id);
  }

  clearValues() {
    this.students.setValue([]);
    this.articleForm.reset();
    this.clearFile();
    this.userSelection.clearComponent();
    this.upload.clearFile();
  }

  getUserSelected(userSelected: any) {
    this.students.setValue(userSelected);
  }

}
