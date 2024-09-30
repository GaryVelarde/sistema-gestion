import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThesisReviewTrackingComponent } from './thesis-review-tracking.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ThesisReviewTrackingComponent }
	])],
	exports: [RouterModule]
})
export class ThesisReviewTrackingRoutingModule { }
