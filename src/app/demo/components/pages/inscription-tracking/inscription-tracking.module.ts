import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InscriptionTrackingComponent } from './inscription-tracking.component';
import { InscriptionTrackingRoutingModule } from './inscription-tracking-routing.module';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InscriptionPresenter } from '../inscription/insctiption-presenter';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        InscriptionTrackingRoutingModule,
        TableModule,
        FileUploadModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        CheckboxModule,
        CalendarModule,
        CardModule,
        TagModule,
        FieldsetModule,
        ConfirmDialogModule,
        DividerModule,
        BadgeModule,
        SkeletonModule,
        AutoCompleteModule,
    ],
    declarations: [InscriptionTrackingComponent],
    providers: [
        InscriptionPresenter,
        provideHttpClient(withInterceptorsFromDi()),
    ],
})
export class InscriptionTrackingModule {}
