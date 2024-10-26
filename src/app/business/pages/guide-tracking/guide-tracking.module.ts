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
import { GuideTrackingComponent } from './guide-tracking.component';
import { GuideTrackingRoutingModule } from './guide-tracking-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GuideTrackingRoutingModule,
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
  ],
  declarations: [GuideTrackingComponent]
})
export class GuideTrackingModule { }
