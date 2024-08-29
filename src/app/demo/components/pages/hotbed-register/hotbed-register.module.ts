import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HotbedRegisterRoutingModule } from './hotbed-register-routing.module';
import { HotbedRegisterComponent } from './hotbed-register.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrossComponentsModule } from '../../cross-components/Cross.module';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HotbedRegisterRoutingModule,
    StepperModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    InputTextareaModule,
    CrossComponentsModule,
    AutoCompleteModule,
  ],
  declarations: [HotbedRegisterComponent]
})
export class HotbedRegisterModule { }
