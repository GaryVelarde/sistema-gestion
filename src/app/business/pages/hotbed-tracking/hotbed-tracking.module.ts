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
import { SkeletonModule } from 'primeng/skeleton';
import { CrossComponentsModule } from '../../cross-components/Cross.module';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';

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
    SkeletonModule,
    CrossComponentsModule,
    TimelineModule,
    CardModule,
    TagModule,
  ],
  declarations: [HotbedTrackingComponent]
})
export class HotbedTrackingModule { }
