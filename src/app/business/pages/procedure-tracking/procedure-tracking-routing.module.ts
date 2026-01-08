import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcedureTrackingComponent } from './procedure-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProcedureTrackingComponent }
	])],
	exports: [RouterModule]
})
export class ProcedureTrackingRoutingModule { }
