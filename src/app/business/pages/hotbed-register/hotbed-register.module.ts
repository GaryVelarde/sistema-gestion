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
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

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
    ToastModule,
    CrossComponentsModule,
    DialogModule,
    SliderModule,
    TableModule,
    TagModule,
  ],
  declarations: [HotbedRegisterComponent]
})
export class HotbedRegisterModule { }
