import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PresentationTrackingComponent } from './presentation-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PresentationTrackingComponent }
	])],
	exports: [RouterModule]
})
export class PresentationTrackingRoutingModule { }
