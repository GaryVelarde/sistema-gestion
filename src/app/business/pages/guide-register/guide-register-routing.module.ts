import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GuideRegisterComponent } from './guide-register.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: GuideRegisterComponent }
	])],
	exports: [RouterModule]
})
export class GuideRegisterRoutingModule { }
