import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InscriptionPresenter {
    formStep1: FormGroup;
    formStep2: FormGroup;
    formStep3: FormGroup;

    private _receptionDate: FormControl = new FormControl('', Validators.required);
    private _fileNumber: FormControl = new FormControl('', Validators.required);
    private _professionalSchool: FormControl = new FormControl('', Validators.required);
    private _reviewer: FormControl = new FormControl('', Validators.required);
    private _student: FormControl = new FormControl('', Validators.required);
	private _studentTwo: FormControl = new FormControl('', Validators.required);

    studentTwoRequired = false;
	studentOneIsValid = false;
	studentTwoIsValid = false;
	dataStudentOneSelected: any;
	dataStudentTwoSelected: any;
    reviewerIsValid = false;
	reviewerSelected: any;

    get receptionDate(){
        return this._receptionDate;
    }
    get fileNumber(){
        return this._fileNumber;
    }
    get professionalSchool(){
        return this._professionalSchool;
    }
    get reviewer(){
        return this._reviewer;
    }
    get student(){
        return this._student;
    }
    get studentTwo(){
        return this._studentTwo;
    }    

    constructor(private fb: FormBuilder) {
        this.formStep1 = this.fb.group({
            receptionDate: this.receptionDate,
            fileNumber: this.fileNumber,
            professionalSchool: this.professionalSchool,
        });

        this.formStep2 = this.fb.group({
			student: this.student,
		})

        this.formStep3 = this.fb.group({
			reviewer: this.reviewer,
		})
    }

    watchEstudent() {
		this.student.valueChanges.pipe().subscribe((data: any) => {
			if (data.code) {
				this.studentOneIsValid = true;
				this.dataStudentOneSelected = data.code;
                console.log('this.dataStudentOneSelected', this.dataStudentOneSelected)
				console.log(data.code);
			} else {
				this.studentOneIsValid = false;
				this.dataStudentOneSelected = {};
			}
		})
	}

	watchEstudentTwo() {
		this.studentTwo.valueChanges.pipe().subscribe((data: any) => {
			if (data.code) {
				this.studentTwoIsValid = true;
				this.dataStudentTwoSelected = data.code;
				console.log(data.code);
			} else {
				this.studentTwoIsValid = false;
				this.dataStudentTwoSelected = {}
			}
		})
	}

	showStudentTwo() {
		this.studentTwoRequired = true;
		this.formStep2.addControl('studentTwo', this.studentTwo);
	}

	hideStudentTwo(){
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
				this.reviewerSelected = data.code
				console.log(data.code);
			} else {
				this.reviewerIsValid = false;
				this.reviewerSelected = {};
			}
		})
	}
}