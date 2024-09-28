import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlansComponent } from './plans.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PlansComponent }
	])],
	exports: [RouterModule]
})
export class PlansRoutingModule { }
