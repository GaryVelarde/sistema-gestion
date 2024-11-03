import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcedureRegisterComponent } from './procedure-register.component';
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
import { ProcedureRegisterRoutingModule } from './procedure-register-routing.module';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProcedureRegisterRoutingModule,
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
    DividerModule,
    DropdownModule,
  ],
  declarations: [ProcedureRegisterComponent]
})
export class ProcedureRegisterModule { }
