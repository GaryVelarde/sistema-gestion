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
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PanelModule } from 'primeng/panel';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ColorPickerModule } from 'primeng/colorpicker';
import { EventsUdiComponent } from './events-udi.component';
import { EventsUdiRoutingModule } from './events-udi-routing.module';
import { MessagesModule } from 'primeng/messages';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DragDropModule } from 'primeng/dragdrop';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { CrossComponentsModule } from '../../cross-components/Cross.module';

@NgModule({
    imports: [
        CommonModule,
        EventsUdiRoutingModule,
        TableModule,
        DragDropModule,
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
        FullCalendarModule,
        PanelModule,
        FloatLabelModule,
        ColorPickerModule,
        MessagesModule,
        ContextMenuModule,
        AutoCompleteModule,
        SidebarModule,
        AvatarModule,
        CrossComponentsModule,
    ],
    declarations: [EventsUdiComponent],
})
export class EventsUdiModule {}
