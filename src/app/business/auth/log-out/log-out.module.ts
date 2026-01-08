import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogOutComponent } from './log-out.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LogOutRoutingModule } from './log-out-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    LogOutRoutingModule
  ],
  declarations: [LogOutComponent]
})
export class LogOutModule { }
