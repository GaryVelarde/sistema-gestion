import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './business/notfound/notfound.component';
import { isUserAuthenticatedGuard } from './guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'pages', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./business/pages/pages.module').then(m => m.PagesModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./business/auth/auth.module').then(m => m.AuthModule) },
            { path: 'api', loadChildren: () => import('./business/auth/reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
            { path: '', loadChildren: () => import('./business/auth/auth.module').then(m => m.AuthModule) },
            { path: 'notfound', component: NotfoundComponent, canActivate: [isUserAuthenticatedGuard] },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
