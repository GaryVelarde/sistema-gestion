import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProcedureRegisterComponent } from './procedure-register.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProcedureRegisterComponent }
	])],
	exports: [RouterModule]
})
export class ProcedureRegisterRoutingModule { }
