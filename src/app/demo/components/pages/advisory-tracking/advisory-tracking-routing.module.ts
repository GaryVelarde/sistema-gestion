import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdvisoryTrackingComponent } from './advisory-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AdvisoryTrackingComponent }
	])],
	exports: [RouterModule]
})
export class AdvisoryTrackingRoutingModule { }
