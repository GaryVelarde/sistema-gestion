import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments/comments.component';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { UserSelectionComponent } from './user-selection/user-selection.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SkeletonModule } from 'primeng/skeleton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoaderComponent } from './loader/loader.component';
import { CardErrorComponent } from './card-error/card-error.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { TableModule } from 'primeng/table';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TaskListComponent } from './task-list/task-list.component';
import { BadgeModule } from 'primeng/badge';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { UploadArchivesComponent } from './upload-archives/upload-archives.component';
import { FileListComponent } from './file-list/file-list.component';
import { ImageModule } from 'primeng/image';
import { CarouselModule } from 'primeng/carousel';
import { MessagesModule } from 'primeng/messages';
import { LabelErrorComponent } from './label-error/label-error.component';

@NgModule({
  imports: [
    CommonModule,
    AvatarModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    AutoCompleteModule,
    SkeletonModule,
    FloatLabelModule,
    BreadcrumbModule,
    RouterModule,
    TableModule,
    SkeletonModule,
    DialogModule,
    TooltipModule,
    BadgeModule,
    CardModule,
    DividerModule,
    CheckboxModule,
    ImageModule,
    CarouselModule,
    MessagesModule,
  ],
  declarations: [
    CommentsComponent,
    UserSelectionComponent,
    LoaderComponent,
    CardErrorComponent,
    BreadcrumbComponent,
    SkeletonTableComponent,
    TaskListComponent,
    UploadArchivesComponent,
    FileListComponent,
    LabelErrorComponent,
  ],
  exports: [
    CommentsComponent,
    UserSelectionComponent,
    LoaderComponent,
    CardErrorComponent,
    BreadcrumbComponent,
    SkeletonTableComponent,
    TaskListComponent,
    UploadArchivesComponent,
    FileListComponent,
    LabelErrorComponent,
  ]
})
export class CrossComponentsModule { }
