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
	formStep4: FormGroup;

	private _receptionDate: FormControl = new FormControl('', Validators.required);
	private _fileNumber: FormControl = new FormControl('', Validators.required);
	private _professionalSchool: FormControl = new FormControl('', Validators.required);
	private _reviewer: FormControl = new FormControl('', Validators.required);
	private _student: FormControl = new FormControl('', Validators.required);
	private _studentTwo: FormControl = new FormControl('', Validators.required);
	private _title: FormControl = new FormControl('', Validators.required);
	private _approveDate: FormControl = new FormControl('', Validators.required);
	private _jobNumber: FormControl = new FormControl('', Validators.required);
	private _resolutionNumber: FormControl = new FormControl('', Validators.required);
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
		})

		this.formStep3 = this.fb.group({
			reviewer: this.reviewer,
		})

		this.formStep4 = this.fb.group({
			title: this.title,
			approveDate: this.approveDate,
			jobNumber: this.jobNumber,
			resolutionNumber: this.resolutionNumber,
			comments: this.comments,
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

	hideStudentTwo() {
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

	callExecute() {
		let studentsArray = [this.student.value.code.id];
		if (this.studentTwo.value) {
			studentsArray.push(this.studentTwo.value.code.id);
		}
		console.log(this.uploadedFiles);
		let files: string[] = [];
		for (let file of this.uploadedFiles) {
			console.log('arch', file.name)
			files.push(file.name);
		}
		
		const request = {
			expediente: this.fileNumber.value,
			escuela_profesional: this.professionalSchool.value.code,
			titulo_proyecto_tesis: this.title.value,
			numero_oficio: this.jobNumber.value,
			numero_resolucion: this.resolutionNumber.value,
			fecha_recepcion_facultad: this.receptionDate.value,
			fecha_aprobacion_udi: this.approveDate.value,
			user_id: this.reviewer.value.code.id,
			user_ids: studentsArray,
			archivos: files,
		};

		console.log(request);
	}
}