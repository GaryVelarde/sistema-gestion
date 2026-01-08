import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscriptionTrackingComponent } from './inscription-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InscriptionTrackingComponent }
	])],
	exports: [RouterModule]
})
export class InscriptionTrackingRoutingModule { }
