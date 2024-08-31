import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit {
  @Output() userSelected: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() typeUserList: string;
  @Input() maxUsersAllow: number;

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
    this.watchUser()
    switch (this.typeUserList) {
      case 'estudiantes':
        this.callGetStudentList();
        break;
      case 'semilleros':
        this.callGetSeedBedsList();
        break;
      case 'docentes':
        this.callTeachersList();
        break;
    }
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
    this.service.getStudentsList().subscribe((res) => {
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
    this.service.getSeedBeds().subscribe((res) => {
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
    this.service.getTeachersList().subscribe((res) => {
      if (res.data) {
        this.getStudentListProcess = 'complete';
        this.studentsList = res.data;
      }

    }, (error) => {
      this.getStudentListProcess = 'error';
    });
  }

  watchUser() {
    this.userFormControl.valueChanges.pipe().subscribe((res: any) => {
      console.log(this.maxUsersAllow)
      console.log(res)
      if (res.length > this.maxUsersAllow) {
        const users = [...res];
        users.splice(this.maxUsersAllow, 1);
        console.log('users', users)
        this.userFormControl.setValue(users);
      }
      this.userSelected.emit(this.userFormControl.value);
    })
  }

  clearComponent() {
    this.userForm.reset();
    this.userFormControl.setValue([]);
  }
}
