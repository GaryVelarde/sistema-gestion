import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';
import { MessageService } from 'primeng/api';

@Component({
	templateUrl: './step1-component.html',
	providers: [MessageService]
})
export class Step1Component implements OnInit {

	options: any[] = [
		{ name: 'ISI - Ingeniería de Sistemas e Informática', code: 'ISI' },
		{ name: 'IET - Ingeniería Electrónica y Telecomunicaciones', code: 'IET' },
		{ name: 'IA - Ingeniería Ambiental', code: 'IA' },
		{ name: 'II - Ingeniería Industrial', code: 'II' },
	];

	constructor(private router: Router, public presenter: InscriptionPresenter,
		private service: MessageService,
	) { }

	ngOnInit(): void {
		this.validateComplete();
	}

	nextStep(): void {
		void this.router.navigate(['pages/new-titulation-process/step2']);
	}

	goToList(): void {
		void this.router.navigate(['pages/inscription-tracking']);
	}

	validateComplete() {
		if (this.presenter.complete) {
			this.presenter.messages = [{ severity: 'success', detail: 'La inscripción de tesis se ha registrado de manera correcta.' }];
			this.presenter.clearValues();
		}

	}

}
