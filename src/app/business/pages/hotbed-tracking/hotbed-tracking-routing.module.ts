import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HotbedTrackingComponent } from './hotbed-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: HotbedTrackingComponent }
	])],
	exports: [RouterModule]
})
export class HotbedTrackingRoutingModule { }
