import { Injectable } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Message } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InscriptionPresenter {
    formStep1: FormGroup;
    formStep2: FormGroup;
    formStep3: FormGroup;
    formStep4: FormGroup;
	messages: Message[] | undefined;

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
    private _approveDate: FormControl = new FormControl(
        '',
        Validators.required
    );
    private _jobNumber: FormControl = new FormControl('', Validators.required);
    private _resolutionNumber: FormControl = new FormControl(
        '',
        Validators.required
    );
    private _comments: FormControl = new FormControl('', Validators.required);

    studentTwoRequired = false;
    studentOneIsValid = false;
    studentTwoIsValid = false;
    dataStudentOneSelected: any;
    dataStudentTwoSelected: any;
    reviewerIsValid = false;
    reviewerSelected: any;
    uploadedFiles: any[] = [];

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

    constructor(private fb: FormBuilder) {
        this.formStep1 = this.fb.group({
            receptionDate: this.receptionDate,
            fileNumber: this.fileNumber,
            professionalSchool: this.professionalSchool,
        });

        this.formStep2 = this.fb.group({
            student: this.student,
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
        this.student.valueChanges.pipe().subscribe((data: any) => {
            if (data.code) {
				if(data === this.dataStudentTwoSelected){
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
        this.studentTwo.valueChanges.pipe().subscribe((data: any) => {
            if (data.code) {
				if(data === this.dataStudentOneSelected){
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
        this.studentTwo.reset();
    }

    validatonForStudentTwo(): boolean {
        return this.studentTwoRequired ? !this.studentTwoIsValid : false;
    }

    watchReviewer() {
        this.reviewer.valueChanges.pipe().subscribe((data: any) => {
            if (data.code) {
                this.reviewerIsValid = true;
                this.reviewerSelected = data;
                console.log(data);
            } else {
                this.reviewerIsValid = false;
                this.reviewerSelected = {};
            }
        });
    }

    callExecute(): any {
        let studentsArray = [this.student.value.id];
        if (this.studentTwo.value) {
            studentsArray.push(this.studentTwo.value.id);
        }
        console.log(this.uploadedFiles);
        let files: string[] = [];
        for (let file of this.uploadedFiles) {
            console.log('arch', file.name);
            files.push(file.name);
        }
        const request = {
            file: this.fileNumber.value,
            professional_school: this.professionalSchool.value.code,
            thesis_project_title: this.title.value,
            office_number: this.jobNumber.value,
            resolution_number: this.resolutionNumber.value,
            reception_date_faculty: this.receptionDate.value,
            approval_date_udi: this.approveDate.value,
            user_id: this.reviewer.value.id,
            user_ids: studentsArray,
            archives: this.uploadedFiles,
            description: this.comments.value,
        };
        console.log(request);
        return request;
    }
}
