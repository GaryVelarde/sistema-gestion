import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotbedTrackingComponent } from './hotbed-tracking.component';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotbedTrackingRoutingModule } from './hotbed-tracking-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  imports: [
    CommonModule,
    HotbedTrackingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToolbarModule,
  ],
  declarations: [HotbedTrackingComponent]
})
export class HotbedTrackingModule { }
