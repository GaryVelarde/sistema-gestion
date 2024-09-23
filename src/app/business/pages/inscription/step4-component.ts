import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ThesisSimilarityService } from 'src/app/services/thesis-similarity.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  templateUrl: './step4-component.html',
  styleUrls: ['./insctiption.component.scss'],
  providers: [MessageService, ThesisSimilarityService],
})
export class Step4Component implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;

  thesisTitles = [];
  results: Array<{ title: string, similarity: number }> = [];
  reader = new FileReader();
  minimumPercentage: number = 60;
  lastMinimumPercentage: number = 60;
  filesSelected = [];
  configCompareTitle: boolean = false;
  formData = new FormData();
  approvalDate: FormControl = new FormControl('');
  jobNumber: FormControl = new FormControl('');

  constructor(private router: Router, public presenter: InscriptionPresenter, private service: MessageService,
    private authService: AuthService, private cd: ChangeDetectorRef, private thesisSimilarity: ThesisSimilarityService) { }

  ngOnInit(): void {
    this.callGetTitlesList();
    setTimeout(() => {
      this.addImageEmptyFiles();
    }, 200);
    this.watchTitle();
  }

  finalize() {
    this.authService.postInscription(this.presenter.callExecute()).subscribe((res) => console.log(res));

    this.showSuccessViaToast();
  }

  backStep() {
    void this.router.navigate(['pages/new-titulation-process/step3']);
  }

  showSuccessViaToast() {
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Message sent' });
  }

  upload(event: UploadEvent) {
    for (let file of event.files) {
      console.log('asasasasa', file)
      this.presenter.uploadedFiles.push(file);
    }
    console.log('final', this.presenter.uploadedFiles)
    this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Archivos subidos con éxito' });
  }

  test() {
    this.service.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
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
        console.log(extension)
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

  addImageEmptyFiles() {
    const fileUploadRows = document.querySelectorAll<HTMLDivElement>('.p-fileupload-content');
    // Itera sobre cada uno de los divs seleccionados
    fileUploadRows.forEach(row => {
      // Agrega una clase con los estilos que deseas aplicar al div
      const textNode = document.createTextNode('Arrastra y suelta los archivos a subir aquí');
      row.style.textAlign = 'center'
      row.style.color = '#d1d5db'
      row.style.border = '2px dashed #d1d5db'

      // Agrega el nodo de texto como hijo del div
      row.appendChild(textNode);
    });
  }

  onSelectedFiles(event) {
    setTimeout(() => {
      this.addWordIcon(event);
    }, 200);
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.formData.append('archives[]', files[i], files[i].name);
      }

      console.log(event.target.files)
      const [file] = event.target.files;
      this.reader.readAsDataURL(file);
      this.reader.onload = () => {
        this.presenter.formStep4.patchValue({
          file: this.reader.result
        });
        for (let file of event.target.files) {
          const fileType = this.getFileType(file.name);
          this.filesSelected.push({
            name: file.name,
            type: fileType,
          });
        }
        this.cd.markForCheck();
      };
    }
  }

  clearFile() {
    this.filesSelected = [];
    this.formData = new FormData();
    this.presenter.file.setValue(null);
    this.fileInput.nativeElement.value = '';
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
    this.presenter.title.valueChanges.pipe().subscribe((value) => {
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
    this.results = this.thesisSimilarity.compareWithThesisTitles(this.presenter.title.value, this.thesisTitles, this.minimumPercentage)
      .sort((a, b) => b.similarity - a.similarity);
    this.configCompareTitle = false;
  }

  callGetTitlesList() {
    this.authService.getTitlesList().pipe().subscribe(
      (res: any) => {
        if(res.data) {
          this.thesisTitles = res.data;
        }
      console.log(res);
    })
  }

}
