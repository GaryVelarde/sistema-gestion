import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';

@Component({
  templateUrl: './step4-component.html',
})
export class Step4Component {

  approvalDate: FormControl = new FormControl('');
  jobNumber: FormControl = new FormControl('');
  
  constructor(private router: Router, private presenter: InscriptionPresenter) { }

  finalize() {
	}

	backStep() {
		void this.router.navigate(['pages/new-titulation-proces/step3']);
	}
}
