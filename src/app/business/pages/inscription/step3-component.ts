import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	templateUrl: './step3-component.html',
})
export class Step3Component implements OnInit {

	data = [];

	filteredCountries: any;

	constructor(private router: Router, public presenter: InscriptionPresenter, private service: AuthService) { }

	ngOnInit(): void {
		this.callGetTeachersList();
		this.presenter.watchReviewer();
	}

	nextStep() {
		void this.router.navigate(['pages/new-titulation-process/step4'])
	}

	backStep() {
		void this.router.navigate(['pages/new-titulation-process/step2']);
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

	callGetTeachersList() {
		this.service.getTeachersList().subscribe((res) => {
			this.data = res.data;
			console.log(res);
		});
	}
}
