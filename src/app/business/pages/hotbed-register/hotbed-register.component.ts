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
  templateUrl: './hotbed-register.component.html',
  styleUrls: ['./hotbed-register.component.scss'],
  styles: [
    `.p-stepper {
        flex-basis: 50rem;
    } `
  ],
  providers: [MessageService, ThesisSimilarityService]

})
export class HotbedRegisterComponent implements OnInit, OnDestroy {
  @ViewChild('userSelection') userSelection: UserSelectionComponent;

  private destroy$ = new Subject<void>();
  filteredItems: any[] | undefined;
  results: Array<{ title: string, similarity: number }> = [];
  minimumPercentage: number = 60;
  lastMinimumPercentage: number = 60;
  configCompareTitle: boolean = false;
  thesisTitles = [];
  articleForm: FormGroup;
  studentsForm: FormGroup;
  private _title = new FormControl('', [Validators.required]);
  private _group = new FormControl('', [Validators.required]);
  private _students = new FormControl([] as IStudent[], [Validators.required])

  get title() {
    return this._title;
  }
  get group() {
    return this._group;
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
      group: this.group
    });
    this.studentsForm = this.fb.group({
      students: this.students,
    });
  }

  ngOnInit() {
    this.callGetTitlesList();
    this.watchStudents();
    this.watchTitle();
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
      group: this.group.value,
      user_ids: this.getIds(this.students.value)
    }
    this.service.postRegisterArticle(rq).pipe(
    ).subscribe(
      (res: any) => {
        if (res.status) {
          this.service.postRegisterArticleFile(this.formData, res.id).pipe(
            finalize(() => {
              this.loaderService.hide();
            })
          ).subscribe(
            (res: any) => {
              if (res.status) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El artículo se ha registrado de manera correcta.' });
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
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al registrar el artículo.' });
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

  watchTitle(): void {
    this.title.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.results = this.thesisSimilarity.compareWithThesisTitles(value, this.thesisTitles, this.minimumPercentage)
          .sort((a, b) => b.similarity - a.similarity);
      }
    });
  }

  getSeverity(status: number): string {
    if (status < 60) {
      return 'info';
    }
    if (status > 70 && status < 90) {
      return 'warning';
    }
    if (status > 90) {
      return 'danger';
    }
    return '';
  }

  showConfigCompareTitle() {
    this.lastMinimumPercentage = this.minimumPercentage;
    this.configCompareTitle = true;
  }

  cancelConfigCompareTitle() {
    this.minimumPercentage = this.lastMinimumPercentage;
    this.configCompareTitle = false;
  }

  saveConfigCompareTitle() {
    this.results = this.thesisSimilarity.compareWithThesisTitles(this.title.value, this.thesisTitles, this.minimumPercentage)
      .sort((a, b) => b.similarity - a.similarity);
    this.configCompareTitle = false;
  }

  callGetTitlesList() {
    this.service.getArticlesTitlesList().pipe(takeUntil(this.destroy$)).subscribe(
      (res: any) => {
        if (res.data) {
          this.thesisTitles = res.data;
        }
      })
  }
}
