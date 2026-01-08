import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HotbedRegisterComponent } from './hotbed-register.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: HotbedRegisterComponent }
	])],
	exports: [RouterModule]
})
export class HotbedRegisterRoutingModule { }
