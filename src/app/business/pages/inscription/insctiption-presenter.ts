import { Injectable } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Message } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { DateFormatService } from 'src/app/services/date-format.service';

interface graduate {
    role: string;
    name: string;
    surnames: string;
    email: string;
    phone: string;
    code: string;
    career: string;
    discharge_date?: string;
    cycle?: string;
}

@Injectable({
    providedIn: 'root',
})
export class InscriptionPresenter {
    complete: boolean = false;
    formStep1: FormGroup;
    formStep2: FormGroup;
    userOneStep2: FormGroup;
    userTwoStep2: FormGroup;
    formStep3: FormGroup;
    formStep4: FormGroup;
    messages: Message[] | undefined;
    private destroy$ = new Subject<void>();

    private _receptionDate: FormControl = new FormControl(
        '',
        Validators.required
    );
    private _fileNumber: FormControl = new FormControl('', Validators.required);
    private _professionalSchool: FormControl = new FormControl(
        '',
        Validators.required
    );
    private _reviewer: FormControl = new FormControl('', Validators.required);
    private _student: FormControl = new FormControl('', Validators.required);
    private _studentTwo: FormControl = new FormControl('', Validators.required);
    private _title: FormControl = new FormControl('', Validators.required);
    private _approveDate: FormControl = new FormControl('');
    private _jobNumber: FormControl = new FormControl('', Validators.required);
    private _resolutionNumber: FormControl = new FormControl(
        '',
        Validators.required
    );
    private _comments: FormControl = new FormControl('');

    private _role: FormControl = new FormControl('', [Validators.required]);
    private _name: FormControl = new FormControl('', [Validators.required]);
    private _lastName: FormControl = new FormControl('', [Validators.required]);
    private _code: FormControl = new FormControl('', [Validators.required]);
    private _number: FormControl = new FormControl('');
    private _email: FormControl = new FormControl('');
    private _cycle: FormControl = new FormControl('');
    private _egressDate: FormControl = new FormControl('');
    private _career: FormControl = new FormControl('');

    private _roleTwo: FormControl = new FormControl('', [Validators.required]);
    private _nameTwo: FormControl = new FormControl('', [Validators.required]);
    private _lastNameTwo: FormControl = new FormControl('', [Validators.required]);
    private _codeTwo: FormControl = new FormControl('', [Validators.required]);
    private _numberTwo: FormControl = new FormControl('');
    private _emailTwo: FormControl = new FormControl('');
    private _cycleTwo: FormControl = new FormControl('');
    private _egressDateTwo: FormControl = new FormControl('');
    private _careerTwo: FormControl = new FormControl('');

    studentTwoRequired = false;
    studentOneIsValid = false;
    studentTwoIsValid = false;
    dataStudentOneSelected: any;
    dataStudentTwoSelected: any;
    reviewerIsValid = false;
    reviewerSelected: any;
    uploadedFiles: any[] = [];

    roleSelected = '';
    roleSelectedTwo = '';

    get receptionDate() {
        return this._receptionDate;
    }
    get fileNumber() {
        return this._fileNumber;
    }
    get professionalSchool() {
        return this._professionalSchool;
    }
    get reviewer() {
        return this._reviewer;
    }
    get student() {
        return this._student;
    }
    get studentTwo() {
        return this._studentTwo;
    }
    get title() {
        return this._title;
    }
    get approveDate() {
        return this._approveDate;
    }
    get jobNumber() {
        return this._jobNumber;
    }
    get resolutionNumber() {
        return this._resolutionNumber;
    }
    get comments() {
        return this._comments;
    }
    get name() {
        return this._name;
    }
    get lastName() {
        return this._lastName;
    }
    get code() {
        return this._code;
    }
    get number() {
        return this._number;
    }
    get email() {
        return this._email;
    }
    get role() {
        return this._role;
    }
    get cycle() {
        return this._cycle;
    }
    get egressDate() {
        return this._egressDate;
    }
    get career() {
        return this._career;
    }
    get nameTwo() {
        return this._nameTwo;
    }
    get lastNameTwo() {
        return this._lastNameTwo;
    }
    get codeTwo() {
        return this._codeTwo;
    }
    get numberTwo() {
        return this._numberTwo;
    }
    get emailTwo() {
        return this._emailTwo;
    }
    get roleTwo() {
        return this._roleTwo;
    }
    get cycleTwo() {
        return this._cycleTwo;
    }
    get egressDateTwo() {
        return this._egressDateTwo;
    }
    get careerTwo() {
        return this._careerTwo;
    }

    constructor(private fb: FormBuilder, private dateFormatService: DateFormatService) {
        this.formStep1 = this.fb.group({
            receptionDate: this.receptionDate,
            fileNumber: this.fileNumber,
            professionalSchool: this.professionalSchool,
        });

        this.formStep2 = this.fb.group({
            student: this.student,
        });

        this.userOneStep2 = this.fb.group({
            role: this.role,
            name: this.name,
            lastName: this.lastName,
            code: this.code,
            email: this.email,
            number: this.number,
            career: this.career,
        });

        this.userTwoStep2 = this.fb.group({
            roleTwo: this.roleTwo,
            nameTwo: this.nameTwo,
            lastNameTwo: this.lastNameTwo,
            codeTwo: this.codeTwo,
            emailTwo: this.emailTwo,
            numberTwo: this.numberTwo,
            careerTwo: this.careerTwo,
        });

        this.formStep3 = this.fb.group({
            reviewer: this.reviewer,
        });

        this.formStep4 = this.fb.group({
            title: this.title,
            approveDate: this.approveDate,
            jobNumber: this.jobNumber,
            resolutionNumber: this.resolutionNumber,
            comments: this.comments,
        });
    }

    watchEstudent() {
        this.student.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            if (data.code) {
                if (data === this.dataStudentTwoSelected) {
                    this.messages = [
                        { severity: 'warn', detail: 'Se está seleccionando el mismo estudiante para ambos campos. Por favor seleccione otro.' },
                    ];
                    return;
                }
                this.messages = [];
                this.studentOneIsValid = true;
                this.dataStudentOneSelected = data;
            } else {
                this.studentOneIsValid = false;
                this.dataStudentOneSelected = {};
            }
        });
    }

    watchEstudentTwo() {
        this.studentTwo.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            if (data.code) {
                if (data === this.dataStudentOneSelected) {
                    this.messages = [
                        { severity: 'warn', detail: 'Se está seleccionando el mismo estudiante para ambos campos. Por favor seleccione otro.' },
                    ];
                    return;
                }
                this.messages = [];
                this.studentTwoIsValid = true;
                this.dataStudentTwoSelected = data;
            } else {
                this.studentTwoIsValid = false;
                this.dataStudentTwoSelected = {};
            }
        });
    }

    showStudentTwo() {
        this.studentTwoRequired = true;
        this.formStep2.addControl('studentTwo', this.studentTwo);
    }

    hideStudentTwo() {
        this.messages = [];
        this.dataStudentTwoSelected = {};
        this.studentTwoRequired = false;
        this.studentTwoIsValid = false;
        this.formStep2.removeControl('studentTwo');
        this.roleSelectedTwo = '';
        this.userTwoStep2.reset();
        this.studentTwo.reset();
    }

    validatonForStudentTwo(): boolean {
        return this.studentTwoRequired ? !this.userTwoStep2.valid : false;
    }

    watchReviewer() {
        this.reviewer.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
            if (data.code) {
                this.reviewerIsValid = true;
                this.reviewerSelected = data;
            } else {
                this.reviewerIsValid = false;
                this.reviewerSelected = {};
            }
        });
    }

    generateRequest(): any {
        // let studentsArray = [this.student.value.id];
        // if (this.studentTwo.value) {
        //     studentsArray.push(this.studentTwo.value.id);
        // }
        const request = {
            file: this.fileNumber.value,
            professional_school: this.professionalSchool.value.code,
            thesis_project_title: this.title.value,
            office_number: this.jobNumber.value,
            resolution_number: this.resolutionNumber.value,
            reception_date_faculty: this.dateFormatService.formatDateDDMMYYYY(this.receptionDate.value),
            approval_date_udi: this.dateFormatService.formatDateDDMMYYYY(this.approveDate.value),
            user_id: this.reviewer.value.id,
            // user_ids: studentsArray,
            graduates: this.generateRequestGraduates(),
            description: this.comments.value,
        };
        return request;
    }

    generateRequestGraduates(): graduate[] {
        let rq = [] as graduate[];
        console.log('this.egressDate.value', this.egressDate.value)
        let userOne = {
            role: this.role.value.code,
            name: this.name.value,
            surnames: this.lastName.value,
            email: this.email.value,
            phone: this.number.value,
            code: this.code.value,
            career: this.career.value
        } as graduate;
        if (this.role.value.code === 'Egresado') {
            userOne.discharge_date = this.egressDate.value ? this.formatDate(this.egressDate.value) : '';
        } else {
            userOne.cycle = this.cycle.value.code;
        }
        rq.push(userOne);
        if (this.studentTwoRequired) {
            let userTwo = {
                role: this.roleTwo.value.code,
                name: this.nameTwo.value,
                surnames: this.lastNameTwo.value,
                email: this.emailTwo.value,
                phone: this.numberTwo.value,
                code: this.codeTwo.value,
                career: this.careerTwo.value
            } as graduate;
            if (this.roleTwo.value.code === 'Egresado') {
                userTwo.discharge_date = this.egressDateTwo.value ? this.formatDate(this.egressDateTwo.value) : '';
            } else {
                userTwo.cycle = this.cycleTwo.value.code;
            }
            rq.push(userTwo);
        }
        return rq;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error("Fecha inválida");
        }
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
      
        return `${year}-${month}-${day}`;
      }
      

    watchRole(): void {
        this.role.valueChanges.pipe().
            subscribe((data) => {
                console.log(data)
                if (data.code) {
                    this.roleSelected = data.code;
                    if (this.roleSelected === 'Estudiante') {
                        this.userOneStep2.addControl('cycle', this.cycle);
                    } else {
                        this.userOneStep2.addControl('egressDate', this.egressDate);
                    }
                }
            })
    }

    watchRoleTwo(): void {
        this.roleTwo.valueChanges.pipe().
            subscribe((data) => {
                console.log(data)
                if (data.code) {
                    this.roleSelectedTwo = data.code;
                    if (this.roleSelectedTwo === 'Estudiante') {
                        this.userTwoStep2.addControl('cycleTwo', this.cycleTwo);
                    } else {
                        this.userTwoStep2.addControl('egressDateTwo', this.egressDateTwo);
                    }
                }
            })
    }

    clearValues() {
        this.formStep1.reset();
        this.formStep2.reset();
        this.formStep3.reset();
        this.formStep4.reset();
        this.complete = false;
    }
}
