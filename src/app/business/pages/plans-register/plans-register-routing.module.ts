import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlansRegisterComponent } from './plans-register.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PlansRegisterComponent }
	])],
	exports: [RouterModule]
})
export class PlansRegisterRoutingModule { }
