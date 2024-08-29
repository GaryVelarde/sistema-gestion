import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './step2-component.html',
})
export class Step2Component implements OnInit {
    studentsList = [];

    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    constructor(
        private router: Router,
        public presenter: InscriptionPresenter,
        private service: AuthService
    ) {}

    ngOnInit(): void {
        this.callGetStudentList();
        this.presenter.watchEstudent();
        this.presenter.watchEstudentTwo();
    }

    nextStep() {
        void this.router.navigate(['pages/new-titulation-process/step3']);
    }

    backStep() {
        void this.router.navigate(['pages/new-titulation-process/step1']);
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

    filterSecondStudents(event: { query: string }) {
        const query = event.query.toLowerCase();
        this.filteredSecondStudents = this.studentsList.filter(
            (student) =>
                student.name.toLowerCase().includes(query) ||
                student.surnames.toLowerCase().includes(query)
        );
        console.log('filteredCountries', this.filteredSecondStudents);
    }

    callGetStudentList() {
        this.getStudentListProcess = 'charging';
        this.service.getStudentsList().subscribe((res) => {
            this.getStudentListProcess = 'complete';
            this.studentsList = res.data;
        }, (error) => {
            this.getStudentListProcess = 'error';
        });
    }
}
