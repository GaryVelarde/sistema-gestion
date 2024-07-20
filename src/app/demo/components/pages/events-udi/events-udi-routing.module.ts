import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsUdiComponent } from './events-udi.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EventsUdiComponent }
	])],
	exports: [RouterModule]
})
export class EventsUdiRoutingModule { }
