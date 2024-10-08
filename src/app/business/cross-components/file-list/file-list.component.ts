import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';
import { FileData } from 'src/app/commons/interfaces/app.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FileListService } from './services/file-list.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit, OnDestroy {
  _reload = false;
  @Input() module: eModule;
  @Input() id: string;
  @Input() buttonEnable: boolean = true;
  @Output() addArchiveClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  status = '';
  messageError: string = 'Se produjo un error al cargar los archivos adjuntos. Por favor, inténtelo de nuevo más tarde';
  skeletonRows = ['1', '2', '3', '4', '5', '6'];
  files: FileData[] = [];
  private destroy$ = new Subject<void>();
  messages = [
    { severity: 'info', detail: 'Aún no se han registrado archivos adjuntos' },
  ];
  responsiveOptions = [
    {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1
    },
    {
      breakpoint: '990px',
      numVisible: 2,
      numScroll: 1
  },
  {
    breakpoint: '760px',
    numVisible: 1,
    numScroll: 1
}
];


  constructor(private service: AuthService, private serviceFile: FileListService, public tokenService: TokenService) { }

  ngOnInit() {
    this.callGetFileList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  callGetFileList() {
    this.status = 'charging';
    this._reload = false;
    switch (this.module) {
      case eModule.advisory:
        this.service.getAdvisoryFiles(this.id).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            this.files = res.data;
            this.status = 'complete';
          }, (error) => {
            this.status = 'error';
          })
        break;
      case eModule.inscription:
        this.service.getInscriptionFiles(this.id).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            this.files = res.data;
            this.status = 'complete';
          }, (error) => {
            this.status = 'error';
          })
        break;
      case eModule.hotbed:
        this.service.getHotbedFiles(this.id).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            this.files = res.data;
            this.status = 'complete';
          }, (error) => {
            this.status = 'error';
          })
        break;
      case eModule.review:
        this.service.getThesisReviewFiles(this.id).pipe(takeUntil(this.destroy$)).subscribe(
          (res: any) => {
            this.files = res.data;
            this.status = 'complete';
          }, (error) => {
            this.status = 'error';
          })
        break;
    }
  }

  isPDF(fileUrl: string): boolean {
    return fileUrl.toLowerCase().endsWith('.pdf');
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
  }

  isWord(fileUrl: string): boolean {
    return /\.(doc|docx)$/i.test(fileUrl);
  }

  isExcel(fileUrl: string): boolean {
    return /\.(xls|xlsx)$/i.test(fileUrl);
  }

  download(url: string) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al descargar el archivo.');
        }
        return response.blob();
      })
      .then(blob => {
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;

        const fileName = url.substring(url.lastIndexOf('/') + 1);
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
      })
      .catch(error => {
        console.error('Error al descargar el archivo:', error);
      });
  }

  deleteArchive(archiveId: string) {
    console.log('archiveId', archiveId)
    switch (this.module) {
      case eModule.advisory:
        this.callDeleteAdvisoryArchive(archiveId);
        break;
      case eModule.inscription:
        this.callDeleteInscriptionArchive(archiveId);
        break;
      case eModule.hotbed:
        this.callDeleteArticleArchive(archiveId);
        break;
      case eModule.review:
        this.callDeleteReviewArchive(archiveId)
        break;
    }
  }

  confirmRemoveArchive(id: string): any[] {
    return this.files = [...this.files.filter(item => item.id !== id)];
  }

  renderImagePreview() {
    const elementToMove = document.querySelector('.p-image-mask');
    document.body.appendChild(elementToMove);
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (targetElement && targetElement.classList.contains('p-image-preview-indicator')) {
      this.renderImagePreview();
    }
  }
  addArchives() {
    this.addArchiveClicked.emit(true);
  }

  handleReload() {
    this.callGetFileList();
  }

  callDeleteArticleArchive(archiveId: string) {
    this.serviceFile.deleteArticleArchive(this.id, archiveId).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveArchive(archiveId);
          }
        }, (error) => {

        })
  }

  callDeleteInscriptionArchive(archiveId: string) {
    this.serviceFile.deleteInscriptionArchive(this.id, archiveId).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveArchive(archiveId);
          }
        }, (error) => {

        })
  }

  callDeleteReviewArchive(archiveId: string) {
    this.serviceFile.deleteReviewArchive(this.id, archiveId).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveArchive(archiveId);
          }
        }, (error) => {

        })
  }

  callDeleteAdvisoryArchive(archiveId: string) {
    this.serviceFile.deleteAdvisoryArchive(this.id, archiveId).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveArchive(archiveId);
          }
        }, (error) => {

        })
  }

  callDeleteEventUdiArchive(archiveId: string) {
    this.serviceFile.deleteEventUdiArchive(this.id, archiveId).pipe(
      takeUntil(this.destroy$)
    ).
      subscribe(
        (res: any) => {
          if (res.status) {
            this.confirmRemoveArchive(archiveId);
          }
        }, (error) => {

        })
  }
}
