import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';

@Component({
	templateUrl: './step1-component.html',
})
export class Step1Component {

	options: any[] = [
        { name: 'ISI', code: 'ISI' },
        { name: 'IET', code: 'IET' },
    ];

	constructor(private router: Router, public presenter: InscriptionPresenter) { }

	nextStep(): void{
		console.log(this.presenter.formStep1)
		void this.router.navigate(['pages/new-titulation-process/step2']);
	}
	
}
