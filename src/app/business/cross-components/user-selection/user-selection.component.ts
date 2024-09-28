import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { userType } from 'src/app/commons/enums/app,enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit, OnDestroy {
  private _disabled: boolean = false;

  @Input() typeUserList: userType;
  @Input() maxUsersAllow: number;
  @Input() usersPreSelected: any[] = [];
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.disabledSelecion();

  }
  @Output() userSelected: EventEmitter<any[]> = new EventEmitter<any[]>();

  private destroy$ = new Subject<void>();
  getStudentListProcess = '';
  filteredStudents: any[];
  studentsList = [];
  filteredItems: any[] | undefined;
  userForm: FormGroup;
  userFormControl = new FormControl([], [Validators.required]);


  constructor(private service: AuthService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      userFormControl: this.userFormControl,
    })
  }

  ngOnInit() {
    switch (this.typeUserList) {
      case userType.student:
        this.callGetStudentList();
        break;
      case userType.hotbed:
        this.callGetSeedBedsList();
        break;
      case userType.teacher:
        this.callTeachersList();
        break;
    }
    this.watchUser();
    this.userFormControl.setValue(this.addFullNameProperty(this.usersPreSelected));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  disabledSelecion(): void {
    this._disabled ? this.userFormControl.disable() : this.userFormControl.enable()
  }

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredItems = this.studentsList
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

  callGetStudentList() {
    this.getStudentListProcess = 'charging';
    this.service.getStudentsList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.data) {
        this.getStudentListProcess = 'complete';
        this.studentsList = res.data;
      }

    }, (error) => {
      this.getStudentListProcess = 'error';
    });
  }

  callGetSeedBedsList() {
    this.getStudentListProcess = 'charging';
    this.service.getSeedBeds().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.data) {
        this.getStudentListProcess = 'complete';
        this.studentsList = res.data;
      }

    }, (error) => {
      this.getStudentListProcess = 'error';
    });
  }

  callTeachersList() {
    this.getStudentListProcess = 'charging';
    this.service.getTeachersList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.data) {
        this.getStudentListProcess = 'complete';
        this.studentsList = res.data;
      }

    }, (error) => {
      this.getStudentListProcess = 'error';
    });
  }

  callEmpty() {
    this.getStudentListProcess = 'complete';
  }

  watchUser() {
    this.userFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res.length > this.maxUsersAllow) {
        const users = [...res];
        users.splice(this.maxUsersAllow, 1);
        this.userFormControl.setValue(users);
      }
      this.userSelected.emit(this.userFormControl.value);
    })
  }

  clearComponent() {
    this.userForm.reset();
    this.userFormControl.setValue([]);
  }

  addFullNameProperty(data: any[]): any[] {
    return data.map(item => ({
      ...item,
      fullName: `${item.name} ${item.surnames}`
    }));
  }

  transformData(data: any[]): any[] {
    return data.map(item => ({
      correo: item.email,
      celular: item.phone,
      codigo: item.code,
      nombres: item.fullName
    }));
  }

  async copyText() {
    try {
      const data = this.transformData(this.userFormControl.value);
      const text = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(text);
      alert('Texto copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar al portapapeles', err);
    }
  }

}
