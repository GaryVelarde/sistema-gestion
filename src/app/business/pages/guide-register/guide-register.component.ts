import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';
import { IStudent } from '../../cross-interfaces/comments-interfaces';
import { ThesisSimilarityService } from 'src/app/services/thesis-similarity.service';

@Component({
  selector: 'app-hotbed-register',
  templateUrl: './guide-register.component.html',
  styleUrls: ['./guide-register.component.scss'],
  styles: [
    `.p-stepper {
        flex-basis: 50rem;
    } `
  ],
  providers: [MessageService, ThesisSimilarityService]

})
export class GuideRegisterComponent implements OnInit, OnDestroy {
  @ViewChild('userSelection') userSelection: UserSelectionComponent;

  private destroy$ = new Subject<void>();
  filteredItems: any[] | undefined;
  thesisTitles = [];
  articleForm: FormGroup;
  studentsForm: FormGroup;
  private _title = new FormControl('', [Validators.required]);
  private _description = new FormControl('', [Validators.required]);
  private _students = new FormControl([] as IStudent[], [Validators.required])

  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get students() {
    return this._students;
  }

  reader = new FileReader();
  filesSelected = [];
  formData = new FormData();


  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef, private router: Router, private service: AuthService,
    private loaderService: LoaderService, private messageService: MessageService, private thesisSimilarity: ThesisSimilarityService,

  ) {
    this.articleForm = this.fb.group({
      title: this.title,
      description: this.description
    });
    this.studentsForm = this.fb.group({
      students: this.students,
    });
  }

  ngOnInit() {
    this.watchStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileChange(files: any) {
    this.formData = files;
  }

  backToList() {
    this.router.navigate(['pages/articulos-semilleros']);
  }

  nextStep() {
    this.loaderService.show();
    const rq = {
      title: this.title.value,
      description: this.description.value,
      user_ids: this.getIds(this.students.value)
    }
    this.service.postRegisterGuide(rq).pipe(
    ).subscribe(
      (res: any) => {
        if (res.status) {
          this.service.postRegisterGuideFile(this.formData, res.id).pipe(
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
              console.log('error 2', error);
            })
        }
      },
      (error) => {
        this.loaderService.hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al registrar la información.' });
        console.log('error 1', error);
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

  watchStudents() {
    this.students.valueChanges.pipe().subscribe((res: IStudent[]) => {
      if (res.length > 2) {
        const students = [...res];
        students.splice(2, 1);
        this.students.setValue(students);
      }
    })
  }

  getIds(arr: IStudent[]) {
    return arr.map(item => item.id);
  }

  clearValues() {
    this.students.setValue([]);
    this.articleForm.reset();
    this.clearFile();
    this.userSelection.clearComponent();
  }

  getUserSelected(userSelected: any) {
    console.log('userSelected', userSelected)
    this.students.setValue(userSelected);
  }

}
