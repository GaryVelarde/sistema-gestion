import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CardModule,
    ButtonModule,
    TabViewModule,
    ReactiveFormsModule,
    FormsModule,
    AvatarModule,
    SkeletonModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }
