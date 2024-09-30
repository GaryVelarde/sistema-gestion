import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { isUserAuthenticatedGuard } from 'src/app/guards/auth.guard';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'new-titulation-process', loadChildren: () => import('./inscription/insctiption.module').then(m => m.InsctiptionModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'inscription-tracking', loadChildren: () => import('./inscription-tracking/inscription-tracking.module').then(m => m.InscriptionTrackingModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'events', loadChildren: () => import('./events/events.module').then(m => m.EventsModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'events-udi', loadChildren: () => import('./events-udi/events-udi.module').then(m => m.EventsUdiModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'asesorias', loadChildren: () => import('./advisory-tracking/advisory-tracking.module').then(m => m.AdvisoryTrackingModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'articulos-semilleros', loadChildren: () => import('./hotbed-tracking/hotbed-tracking.module').then(m => m.HotbedTrackingModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'registrar-semilleros', loadChildren: () => import('./hotbed-register/hotbed-register.module').then(m => m.HotbedRegisterModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'plans', loadChildren: () => import('./plans/plans.module').then(m => m.PlansModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'budget', loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule), canActivate: [isUserAuthenticatedGuard] },
        { path: 'thesis-review-tracking', loadChildren: () => import('./thesis-review-tracking/thesis-review-tracking.module').then(m => m.ThesisReviewTrackingModule), canActivate: [isUserAuthenticatedGuard] },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
