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
    FloatLabelModule
  ],
  declarations: [CommentsComponent, UserSelectionComponent, LoaderComponent, CardErrorComponent],
  exports: [CommentsComponent, UserSelectionComponent, LoaderComponent, CardErrorComponent]
})
export class CrossComponentsModule { }
