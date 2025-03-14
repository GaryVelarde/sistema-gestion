import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './step2-component.html',
})
export class Step2Component implements OnInit {
    studentsList = [];
    roles: any[] = [
        { name: 'Egresado', code: 'Egresado' },
        { name: 'Estudiante', code: 'Estudiante' },
    ];
    cycles: any[] = [
        { name: 'I', code: 'I' },
        { name: 'II', code: 'II' },
        { name: 'III', code: 'III' },
        { name: 'IV', code: 'IV' },
        { name: 'V', code: 'V' },
        { name: 'VI', code: 'VI' },
        { name: 'VII', code: 'VII' },
        { name: 'VIII', code: 'VIII' },
        { name: 'IX', code: 'IX' },
        { name: 'X', code: 'X' },
    ];
    filteredStudents: any[];
    filteredSecondStudents: any[];
    getStudentListProcess = '';
    constructor(
        private router: Router,
        public presenter: InscriptionPresenter,
        private service: AuthService
    ) { }

    ngOnInit(): void {
        this.callGetStudentList();
        this.presenter.watchEstudent();
        this.presenter.watchEstudentTwo();
        this.presenter.watchRole();
        this.presenter.watchRoleTwo();
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
    }

    filterSecondStudents(event: { query: string }) {
        const query = event.query.toLowerCase();
        this.filteredSecondStudents = this.studentsList.filter(
            (student) =>
                student.name.toLowerCase().includes(query) ||
                student.surnames.toLowerCase().includes(query)
        );
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
