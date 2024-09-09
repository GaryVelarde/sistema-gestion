import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        ButtonModule,
        RouterModule,
    ],
    declarations: [AccessComponent]
})
export class AccessModule { }
