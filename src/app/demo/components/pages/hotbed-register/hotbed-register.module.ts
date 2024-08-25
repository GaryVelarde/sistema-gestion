import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotbedRegisterComponent } from './hotbed-register.component';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotbedRegisterRoutingModule } from './hotbed-register-routing.module';
import { StepperModule } from 'primeng/stepper';


@NgModule({
  imports: [
    CommonModule,
    HotbedRegisterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToolbarModule,
    StepperModule,
  ],
  declarations: [HotbedRegisterComponent]
})
export class HotbedRegisterModule { }
