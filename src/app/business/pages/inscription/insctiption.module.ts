import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { Step1Component } from './step1.component';
import { Step2Component } from './step2-component';
import { Step3Component } from './step3-component';
import { Step4Component } from './step4-component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InsctiptionComponent } from './insctiption.component';
import { InscriptionPresenter } from './insctiption-presenter';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { ProgressBarModule } from 'primeng/progressbar';
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessagesModule } from 'primeng/messages';
import { CrossComponentsModule } from '../../cross-components/Cross.module';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AvatarModule } from 'primeng/avatar';
import { SliderModule } from 'primeng/slider';
import { MessageService } from 'primeng/api';

@NgModule({
    declarations: [
        InsctiptionComponent,
        Step1Component,
        Step2Component,
        Step3Component,
        Step4Component,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [RouterModule],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        StepsModule,
        TieredMenuModule,
        MenuModule,
        ButtonModule,
        ContextMenuModule,
        MegaMenuModule,
        PanelMenuModule,
        InputTextModule,
        AutoCompleteModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        ToastModule,
        FileUploadModule,
        CardModule,
        SkeletonModule,
        MessagesModule,
        BadgeModule,
        ProgressBarModule,
        CrossComponentsModule,
        TableModule,
        TagModule,
        DialogModule,
        KeyFilterModule,
        AvatarModule,
        SliderModule,
        RouterModule.forChild([
            {
                path: '',
                component: InsctiptionComponent,
                children: [
                    { path: '', redirectTo: 'step1', pathMatch: 'full' },
                    { path: 'step1', component: Step1Component },
                    { path: 'step2', component: Step2Component },
                    { path: 'step3', component: Step3Component },
                    { path: 'step4', component: Step4Component },
                ],
            },
        ]),
    ],
    providers: [
        InscriptionPresenter,
        MessageService,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class InsctiptionModule {}
