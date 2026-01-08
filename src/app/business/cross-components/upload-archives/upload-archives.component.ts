import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-upload-archives',
  templateUrl: './upload-archives.component.html',
  styleUrls: ['./upload-archives.component.scss']
})
export class UploadArchivesComponent implements OnInit {
  _clear = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() onFileChangeEmitter: EventEmitter<FormData> = new EventEmitter<FormData>();
  @Output() clearFilesEmitter: EventEmitter<FormData> = new EventEmitter<FormData>();

  reader = new FileReader();
  filesSelected = [];
  formData = new FormData();

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  clearFile() {
    this.filesSelected = [];
    this.formData = new FormData();
    this.fileInput.nativeElement.value = '';
    this.clearFilesEmitter.emit(this.formData);
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.formData.append('archives[]', files[i], files[i].name);
      }
      const [file] = event.target.files;
      this.reader.readAsDataURL(file);
      this.reader.onload = () => {
        this.onFileChangeEmitter.emit(this.formData);
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

  getFileType(fileName: string): string | null {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return null;
    }
    const fileType = fileName.substring(lastDotIndex + 1).toLowerCase();
    return fileType;
  }

}
