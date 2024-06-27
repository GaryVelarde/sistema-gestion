import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	templateUrl: './step2-component.html',
})
export class Step2Component implements OnInit {

	data = [
	];

	filteredCountries: any[];

	constructor(private router: Router, public presenter: InscriptionPresenter, private service: AuthService) { }

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
		for (let i = 0; i < this.data.length; i++) {
			const country = this.data[i];
			if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
				filtered.push(country);
			}
		}
		this.filteredCountries = filtered;
	}

	callGetStudentList(){
		this.service.getStudentsList().subscribe((res) => {
			console.log(res)
			this.data = res.graduates_students;
		})
	}
}
