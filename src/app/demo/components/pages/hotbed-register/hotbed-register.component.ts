import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IStudent } from '../../cross-interfaces/comments-interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { UserSelectionComponent } from '../../cross-components/user-selection/user-selection.component';

@Component({
  selector: 'app-hotbed-register',
  templateUrl: './hotbed-register.component.html',
  styleUrls: ['./hotbed-register.component.scss'],
  styles: [
    `.p-stepper {
        flex-basis: 50rem;
    } `
  ],
  providers: [MessageService]

})
export class HotbedRegisterComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('userSelection') userSelection: UserSelectionComponent;


  usuarios: IStudent[] = [
    {
      "id": 4,
      "name": "Mario",
      "surnames": "Ayala Sanchez",
      "email": "mario@testt.com",
      "phone": '987145312',
      "code": '15467824'
    },
    {
      "id": 5,
      "name": "Daniel",
      "surnames": "Minaya Alvarez",
      "email": "daniel@testt.com",
      "phone": '987145312',
      "code": '15467824'
    },
    {
      "id": 6,
      "name": "Lucía",
      "surnames": "Martinez Herrera",
      "email": "lucia@testt.com",
      "phone": '981245312',
      "code": '12547896'
    },
    {
      "id": 7,
      "name": "Javier",
      "surnames": "Lopez Diaz",
      "email": "javier@testt.com",
      "phone": '987654321',
      "code": '11457832'
    },
    {
      "id": 8,
      "name": "Ana",
      "surnames": "Perez Morales",
      "email": "ana@testt.com",
      "phone": '986532147',
      "code": '11326745'
    },
    {
      "id": 9,
      "name": "Carlos",
      "surnames": "Ramirez Soto",
      "email": "carlos@testt.com",
      "phone": '985641237',
      "code": '15478965'
    },
    {
      "id": 10,
      "name": "Valeria",
      "surnames": "Rojas Gutierrez",
      "email": "valeria@testt.com",
      "phone": '984512376',
      "code": '12547896'
    }
  ];
  filteredItems: any[] | undefined;
  articleForm: FormGroup;
  studentsForm: FormGroup;
  private _title = new FormControl('', [Validators.required]);
  private _file = new FormControl(File || null);
  private _group = new FormControl('', [Validators.required]);
  private _students = new FormControl([] as IStudent[], [Validators.required])

  get title() {
    return this._title;
  }
  get file() {
    return this._file;
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
    private loaderService: LoaderService, private messageService: MessageService,
  ) {
    this.articleForm = this.fb.group({
      title: this.title,
      file: this.file,
      group: this.group
    });
    this.studentsForm = this.fb.group({
      students: this.students,
    });
  }

  ngOnInit() {
    this.watchStudents();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file)
    this.file.setValue(file)
    this.articleForm.patchValue({
      file: file
    });
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
        this.articleForm.patchValue({
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
    this.file.setValue(null);
    this.fileInput.nativeElement.value = ''; // Limpiar el valor del input file
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.usuarios
      .filter(
        (usuario) =>
          usuario.name.toLowerCase().includes(query) ||
          usuario.surnames.toLowerCase().includes(query)
      )
      .map((usuario) => ({
        ...usuario,
        fullName: `${usuario.name} ${usuario.surnames}`,
      }));
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

  getUserSelected(userSelected: any){
    console.log('userSelected', userSelected)
    this.students.setValue(userSelected);
  }
}
