import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';
import { CrossComponentsModule } from '../../cross-components/Cross.module';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { ProcedureTrackingComponent } from './procedure-tracking.component';
import { ProcedureTrackingRoutingModule } from './procedure-tracking-routing.module';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ProcedureTrackingRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    DialogModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    ToolbarModule,
    SkeletonModule,
    CrossComponentsModule,
    TimelineModule,
    CardModule,
    TagModule,
    SidebarModule,
    CalendarModule,
    TooltipModule,
  ],
  declarations: [ProcedureTrackingComponent]
})
export class ProcedureTrackingModule { }
