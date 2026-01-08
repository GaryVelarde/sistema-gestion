import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GuideTrackingComponent } from './guide-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: GuideTrackingComponent }
	])],
	exports: [RouterModule]
})
export class GuideTrackingRoutingModule { }
