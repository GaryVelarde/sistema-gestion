import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-selection',
  templateUrl: './user-selection.component.html',
  styleUrls: ['./user-selection.component.scss']
})
export class UserSelectionComponent implements OnInit {
  @Output() userSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() typeUserList: string;

  getStudentListProcess = '';
  filteredStudents: any[];
  studentsList = [];

  studentForm: FormGroup;
  studentFormControl = new FormControl([], [Validators.required]);


  constructor(private service: AuthService, private fb: FormBuilder) {
    this.studentForm = this.fb.group({
      studentFormControl: this.studentFormControl,
    })
  }

  ngOnInit() {
    if(this.typeUserList === 'estudiantes') {
      this.callGetStudentList();
    } else {
      this.callGetSeedBedsList();
    }
    this.watchStudent()
  }

  filterCountry(event: any) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.studentsList.length; i++) {
      const country = this.studentsList[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filteredStudents = filtered;
  }

  filterStudents(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.filteredStudents = this.studentsList.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.surnames.toLowerCase().includes(query)
    );
    console.log('filteredCountries', this.filteredStudents);
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

  watchStudent() {
    this.studentFormControl.valueChanges.pipe().subscribe((res: any) => {
      if (res.email) {
        this.userSelected.emit(res);
      }
    })
  }


}
