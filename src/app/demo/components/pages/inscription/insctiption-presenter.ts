import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InscriptionPresenter {
    private dataSubject = new BehaviorSubject<string>('Initial Data');
    data$ = this.dataSubject.asObservable();

    formStep1: FormGroup;
    formStep2: FormGroup;
    formStep3: FormGroup;

    private _receptionDate: FormControl = new FormControl('', Validators.required);
    private _fileNumber: FormControl = new FormControl('', Validators.required);
    private _professionalSchool: FormControl = new FormControl('', Validators.required);
    private _reviewer: FormControl = new FormControl('', Validators.required);
    private _student: FormControl = new FormControl('', Validators.required);
	private _studentTwo: FormControl = new FormControl('', Validators.required);

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

    updateData(newData: string) {
        this.dataSubject.next(newData);
    }

    prueba() {
        console.log('prueba');
    }
}