import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BudgetComponent } from './budget.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BudgetComponent }
	])],
	exports: [RouterModule]
})
export class BudgetRoutingModule { }
