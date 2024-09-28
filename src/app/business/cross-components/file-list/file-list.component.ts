import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { eModule } from 'src/app/commons/enums/app,enum';
import { FileData } from 'src/app/commons/interfaces/app.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {
  _reload = false;
  @Input() module: eModule;
  @Input() id: string;
  @Input() buttonEnable: boolean = true;
  @Output() addArchiveClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  set reload(value: boolean) {
    this._reload = value;
    if (this._reload) {
      console.log('reload archives')
      this.callGetFileList();
    }
  }
  status = '';
  skeletonRows = ['1', '2', '3', '4', '5', '6'];
  files: FileData[] = [];
  private destroy$ = new Subject<void>();
  messages = [
    { severity: 'info', detail: 'Aún no se han registrado archivos adjuntos' },
  ];



  //[
  //   {
  //     "id": "9d144a49-3c94-4d26-9904-c6b9b1b05a2c",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/8yuMpiCVKlRFAxBeKhMuZzrrIR1MXi45Oj5B9yhH.pdf",
  //     "created_at": "23-09-2024 10:18:32"
  //   },
  //   {
  //     "id": "9d144a49-3c94-4d26-9904-c6b9b1b05a2c",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/8yuMpiCVKlRFAxBeKhMuZzrrIR1MXi45Oj5B9yhH.pdf",
  //     "created_at": "23-09-2024 10:18:32"
  //   },
  //   {
  //     "id": "9d144a49-3c94-4d26-9904-c6b9b1b05a2c",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/8yuMpiCVKlRFAxBeKhMuZzrrIR1MXi45Oj5B9yhH.pdf",
  //     "created_at": "23-09-2024 10:18:32"
  //   },
  //   {
  //     "id": "9d193806-6c2c-40ba-b7aa-73ac069fd9a2",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/KDUx1o46e1XCGFzHm9SNmJ32UrXS5sKfuA8doIfT.xlsx",
  //     "created_at": "25-09-2024 21:06:36"
  //   },
  //   {
  //     "id": "9d1aa46e-22d9-431e-97ac-437a201a0156",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/CDLHbUrUf7ZTIEyMByzwFPrCUmGcuyGXSp1cARxS.docx",
  //     "created_at": "26-09-2024 14:05:34"
  //   },
  //   {
  //     "id": "9d1aa46f-e6c8-4117-87c2-5a6b6dbdde97",
  //     "archive": "https://pub-5f6388a436924c6bb9869b960ccdcfab.r2.dev/uploads/aidvrmUIjKAZevQEEvvV5yWxBpbOQoiOQIehZkAB.png",
  //     "created_at": "26-09-2024 14:05:35"
  //   }
  constructor(private service: AuthService) { }

  ngOnInit() {
    this.callGetFileList();
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
        return response.blob(); // Obtener los datos del archivo como Blob
      })
      .then(blob => {
        const fileURL = window.URL.createObjectURL(blob); // Crear una URL para el Blob
        const link = document.createElement('a');
        link.href = fileURL;

        // Extraer el nombre del archivo desde la URL
        const fileName = url.substring(url.lastIndexOf('/') + 1);
        link.download = fileName;

        // Simular el clic para iniciar la descarga
        document.body.appendChild(link);
        link.click();

        // Limpiar el enlace temporal y la URL creada
        document.body.removeChild(link);
        window.URL.revokeObjectURL(fileURL);
      })
      .catch(error => {
        console.error('Error al descargar el archivo:', error);
      });
  }

  renderImagePreview() {
    const elementToMove = document.querySelector('.p-image-mask');

    // Verifica que el elemento exista antes de moverlo
    if (elementToMove) {
      // Mueve el elemento al final del body
      document.body.appendChild(elementToMove);
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    // Verifica si el elemento clickeado tiene la clase 'p-image-preview-indicator'
    if (targetElement && targetElement.classList.contains('p-image-preview-indicator')) {
      this.renderImagePreview();
      // Aquí puedes añadir la lógica que quieras cuando se haga clic en el botón
    }
  }
  addArchives() {
    this.addArchiveClicked.emit(true);
  }
}
