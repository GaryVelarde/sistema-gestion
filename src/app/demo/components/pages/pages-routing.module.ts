import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
        { path: 'empty', loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
        { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
        { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
        { path: 'new-titulation-process', loadChildren: () => import('./inscription/insctiption.module').then(m => m.InsctiptionModule) },
        { path: 'inscription-tracking', loadChildren: () => import('./inscription-tracking/inscription-tracking.module').then(m => m.InscriptionTrackingModule) },
        { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule) },
        { path: 'events-udi', loadChildren: () => import('./events-udi/events-udi.module').then(m => m.EventsUdiModule) },
        { path: 'asesorias', loadChildren: () => import('./advisory-tracking/advisory-tracking.module').then(m => m.AdvisoryTrackingModule) },
        { path: 'articulos-semilleros', loadChildren: () => import('./hotbed-tracking/hotbed-tracking.module').then(m => m.HotbedTrackingModule) },
        { path: 'registrar-semilleros', loadChildren: () => import('./hotbed-register/hotbed-register.module').then(m => m.HotbedRegisterModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
