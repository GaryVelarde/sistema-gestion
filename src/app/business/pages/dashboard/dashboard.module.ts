import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { CrossComponentsModule } from '../../cross-components/Cross.module';
import { DegreeProcessCardsComponent } from './components/degree-process-cards/degree-process-cards.component';
import { SimilarityTitlesComponent } from './components/similarity-titles/similarity-titles.component';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SliderModule } from 'primeng/slider';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        TooltipModule,
        SkeletonModule,
        CrossComponentsModule,
        InputTextModule,
        ReactiveFormsModule,
        FormsModule,
        DialogModule,
        SliderModule,
        DividerModule,
        ScrollPanelModule,
        InputTextareaModule,
        FloatLabelModule,
        DropdownModule,
    ],
    declarations: [DashboardComponent, DegreeProcessCardsComponent, SimilarityTitlesComponent]
})
export class DashboardModule { }
