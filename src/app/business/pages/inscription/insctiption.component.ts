import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { InscriptionPresenter } from './insctiption-presenter';

@Component({
    templateUrl: './insctiption.component.html',
    styles: [`
        :host ::ng-deep .p-menubar-root-list {
            flex-wrap: wrap;
        }
    `],
    providers: [InscriptionPresenter]
})
export class InsctiptionComponent implements OnDestroy {
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/' },
        { label: 'Proceso de titulación' },
        { label: 'Proyecto de tesis', },
        { label: 'Registrar inscripción', visible: true },
    ];
    routeItems: MenuItem[] = [
        { label: 'Datos de UDI', routerLink: 'step1' },
        { label: 'Datos de los estudiantes', routerLink: 'step2' },
        { label: 'Datos del revisor', routerLink: 'step3' },
        { label: 'Datos de la tesis', routerLink: 'step4' },
    ];

    constructor(private presenter: InscriptionPresenter) {

    }

    ngOnDestroy(): void {
        this.presenter.clearValues()
    }
}
