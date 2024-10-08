import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ThesisSimilarityService } from 'src/app/services/thesis-similarity.service';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  templateUrl: './step4-component.html',
  styleUrls: ['./insctiption.component.scss'],
  providers: [MessageService, ThesisSimilarityService],
})
export class Step4Component implements OnInit, OnDestroy {
  thesisTitles = [];
  statusTitlesList = '';
  messsageTitlesError = 'Hubo un problema al recopilar información, por favor vuelve a intentarlo más tarde.';
  results: Array<{ title: string, similarity: number }> = [];
  reader = new FileReader();
  minimumPercentage: number = 60;
  lastMinimumPercentage: number = 60;
  configCompareTitle: boolean = false;
  formData = new FormData();
  approvalDate: FormControl = new FormControl('');
  jobNumber: FormControl = new FormControl('');
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public presenter: InscriptionPresenter,
    private service: MessageService,
    private authService: AuthService,
    private thesisSimilarity: ThesisSimilarityService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.callGetTitlesList();
    this.watchTitle();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  finalize() {
    this.loaderService.show(true);
    this.authService.postInscription(this.presenter.generateRequest()).pipe(
    ).subscribe(
      (res) => {
        if (res.status) {
          this.authService.postRegisterIncriptionFile(this.formData, res.id).pipe(
            finalize(() => {
              this.loaderService.hide();
            })
          ).subscribe(
            (res: any) => {
              if (res.status) {
                this.presenter.complete = true;
                this.router.navigate(['/pages/new-titulation-process/step1'])
              }
            }, (error) => {
              this.presenter.complete = false;
              this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al guardar los archivos.' });
            })
        }
      },
      (error) => {
        this.loaderService.hide();
        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error al registrar la inscripción' });
      });
  }

  backStep() {
    void this.router.navigate(['pages/new-titulation-process/step3']);
  }

  addWordIcon(event: any) {
    let position: number = 0;
    const fileUploadRows = document.querySelectorAll<HTMLDivElement>('.p-fileupload-row');
    fileUploadRows.forEach(row => {
      const firstChildDiv = row.querySelector<HTMLDivElement>('div:first-child');
      if (firstChildDiv) {
        const fileName = event.currentFiles[position].name;
        const parts = fileName.split('.');
        const extension = parts[parts.length - 1];
        let image = '';
        switch (extension) {
          case 'doc':
          case 'docx':
            image = 'word-icon.png';
            break;
          case 'pdf':
            image = 'pdf-icon.png';
            break
          case 'xls':
          case 'xlsx':
            image = 'excel-icon.png';
            break
        }
        firstChildDiv.style.backgroundImage = "url('/assets/img/" + image + "')";
        firstChildDiv.style.backgroundSize = '59px 50px';
        firstChildDiv.style.backgroundPosition = 'center';
        firstChildDiv.style.backgroundRepeat = 'no-repeat';
        firstChildDiv.style.height = '50px'
        position++;
      }
    });
  }

  clearFile() {
    this.formData = new FormData();
  }

  getFileType(fileName: string): string | null {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null;
    }
    const fileType = fileName.substring(lastDotIndex + 1).toLowerCase();
    return fileType;
  }

  watchTitle(): void {
    this.presenter.title.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.results = this.thesisSimilarity.compareWithThesisTitles(value, this.thesisTitles, this.minimumPercentage)
          .sort((a, b) => b.similarity - a.similarity);
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
    this.results = this.thesisSimilarity.compareWithThesisTitles(this.presenter.title.value, this.thesisTitles, this.minimumPercentage)
      .sort((a, b) => b.similarity - a.similarity);
    this.configCompareTitle = false;
  }

  callGetTitlesList() {
    this.statusTitlesList = 'charging';
    this.authService.getTitlesList().pipe(takeUntil(this.destroy$)).
    subscribe(
      (res: any) => {
        if (res.data) {
          this.statusTitlesList = 'complete';
          this.thesisTitles = res.data;
        }
      }, (error) => {
        this.statusTitlesList = 'error';
      })
  }

  onFileChange(files: any) {
    this.formData = files;
  }
}
