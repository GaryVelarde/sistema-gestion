import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionPresenter } from './insctiption-presenter';

@Component({
	templateUrl: './step2-component.html',
})
export class Step2Component implements OnInit {

	data = [
		{
			"name": "Laura Pérez",
			"code": {
				"id": 1,
				"name": "Laura",
				"lastname": "Pérez",
				"celular": "+1647555077",
				"email": "laura.pérez@mail.com"
			}
		},
		{
			"name": "María González",
			"code": {
				"id": 2,
				"name": "María",
				"lastname": "González",
				"celular": "+1369673403",
				"email": "maría.gonzález@mail.com"
			}
		},
		{
			"name": "Pedro Pérez",
			"code": {
				"id": 3,
				"name": "Pedro",
				"lastname": "Pérez",
				"celular": "+1487187928",
				"email": "pedro.pérez@test.org"
			}
		},
		{
			"name": "Jorge Ramírez",
			"code": {
				"id": 4,
				"name": "Jorge",
				"lastname": "Ramírez",
				"celular": "+1195352041",
				"email": "jorge.ramírez@example.com"
			}
		},
		{
			"name": "Carlos Ramírez",
			"code": {
				"id": 5,
				"name": "Carlos",
				"lastname": "Ramírez",
				"celular": "+1240849254",
				"email": "carlos.ramírez@mail.com"
			}
		},
		{
			"name": "Carlos Martínez",
			"code": {
				"id": 6,
				"name": "Carlos",
				"lastname": "Martínez",
				"celular": "+1564717964",
				"email": "carlos.martínez@example.com"
			}
		},
		{
			"name": "Carlos González",
			"code": {
				"id": 7,
				"name": "Carlos",
				"lastname": "González",
				"celular": "+1446044213",
				"email": "carlos.gonzález@mail.com"
			}
		},
		{
			"name": "Sofía López",
			"code": {
				"id": 8,
				"name": "Sofía",
				"lastname": "López",
				"celular": "+1515633572",
				"email": "sofía.lópez@mail.com"
			}
		},
		{
			"name": "Laura García",
			"code": {
				"id": 9,
				"name": "Laura",
				"lastname": "García",
				"celular": "+1403454299",
				"email": "laura.garcía@example.com"
			}
		},
		{
			"name": "Carlos Cruz",
			"code": {
				"id": 10,
				"name": "Carlos",
				"lastname": "Cruz",
				"celular": "+1898274704",
				"email": "carlos.cruz@mail.com"
			}
		},
		{
			"name": "Luis Rodríguez",
			"code": {
				"id": 11,
				"name": "Luis",
				"lastname": "Rodríguez",
				"celular": "+1781965890",
				"email": "luis.rodríguez@example.com"
			}
		},
		{
			"name": "Marta Rodríguez",
			"code": {
				"id": 12,
				"name": "Marta",
				"lastname": "Rodríguez",
				"celular": "+1954119225",
				"email": "marta.rodríguez@test.org"
			}
		},
		{
			"name": "Luis Rodríguez",
			"code": {
				"id": 13,
				"name": "Luis",
				"lastname": "Rodríguez",
				"celular": "+1611932056",
				"email": "luis.rodríguez@mail.com"
			}
		},
		{
			"name": "Ana López",
			"code": {
				"id": 14,
				"name": "Ana",
				"lastname": "López",
				"celular": "+1254056875",
				"email": "ana.lópez@example.com"
			}
		},
		{
			"name": "Jorge Rodríguez",
			"code": {
				"id": 15,
				"name": "Jorge",
				"lastname": "Rodríguez",
				"celular": "+1280610494",
				"email": "jorge.rodríguez@example.com"
			}
		},
		{
			"name": "Pedro Cruz",
			"code": {
				"id": 16,
				"name": "Pedro",
				"lastname": "Cruz",
				"celular": "+1209780100",
				"email": "pedro.cruz@test.org"
			}
		},
		{
			"name": "Jorge Martínez",
			"code": {
				"id": 17,
				"name": "Jorge",
				"lastname": "Martínez",
				"celular": "+1926283918",
				"email": "jorge.martínez@test.org"
			}
		},
		{
			"name": "Marta Cruz",
			"code": {
				"id": 18,
				"name": "Marta",
				"lastname": "Cruz",
				"celular": "+1557087862",
				"email": "marta.cruz@mail.com"
			}
		},
		{
			"name": "Marta Cruz",
			"code": {
				"id": 19,
				"name": "Marta",
				"lastname": "Cruz",
				"celular": "+1710928525",
				"email": "marta.cruz@test.org"
			}
		},
		{
			"name": "Marta García",
			"code": {
				"id": 20,
				"name": "Marta",
				"lastname": "García",
				"celular": "+1788498883",
				"email": "marta.garcía@example.com"
			}
		},
		{
			"name": "Sofía García",
			"code": {
				"id": 21,
				"name": "Sofía",
				"lastname": "García",
				"celular": "+1495827788",
				"email": "sofía.garcía@mail.com"
			}
		},
		{
			"name": "Laura Martínez",
			"code": {
				"id": 22,
				"name": "Laura",
				"lastname": "Martínez",
				"celular": "+1161107339",
				"email": "laura.martínez@test.org"
			}
		},
		{
			"name": "Pedro Ramírez",
			"code": {
				"id": 23,
				"name": "Pedro",
				"lastname": "Ramírez",
				"celular": "+1971899166",
				"email": "pedro.ramírez@example.com"
			}
		},
		{
			"name": "Sofía García",
			"code": {
				"id": 24,
				"name": "Sofía",
				"lastname": "García",
				"celular": "+1620044878",
				"email": "sofía.garcía@mail.com"
			}
		},
		{
			"name": "Ana Hernández",
			"code": {
				"id": 25,
				"name": "Ana",
				"lastname": "Hernández",
				"celular": "+1392647877",
				"email": "ana.hernández@test.org"
			}
		},
		{
			"name": "Ana Hernández",
			"code": {
				"id": 26,
				"name": "Ana",
				"lastname": "Hernández",
				"celular": "+1947103870",
				"email": "ana.hernández@test.org"
			}
		},
		{
			"name": "Juan García",
			"code": {
				"id": 27,
				"name": "Juan",
				"lastname": "García",
				"celular": "+1522017153",
				"email": "juan.garcía@example.com"
			}
		},
		{
			"name": "Sofía García",
			"code": {
				"id": 28,
				"name": "Sofía",
				"lastname": "García",
				"celular": "+1979803171",
				"email": "sofía.garcía@mail.com"
			}
		},
		{
			"name": "Sofía González",
			"code": {
				"id": 29,
				"name": "Sofía",
				"lastname": "González",
				"celular": "+1645949170",
				"email": "sofía.gonzález@test.org"
			}
		},
		{
			"name": "Carlos Ramírez",
			"code": {
				"id": 30,
				"name": "Carlos",
				"lastname": "Ramírez",
				"celular": "+1298607422",
				"email": "carlos.ramírez@test.org"
			}
		}
	];

	filteredCountries: any[];

	constructor(private router: Router, public presenter: InscriptionPresenter) { }

	ngOnInit(): void {
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
}
