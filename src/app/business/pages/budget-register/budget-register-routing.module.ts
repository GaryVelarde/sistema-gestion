import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BudgetRegisterComponent } from './budget-register.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BudgetRegisterComponent }
	])],
	exports: [RouterModule]
})
export class BudgetRegisterRoutingModule { }
