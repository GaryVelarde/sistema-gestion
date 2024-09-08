import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './insctiption.component.html',
    styles: [`
        :host ::ng-deep .p-menubar-root-list {
            flex-wrap: wrap;
        }
    `],
})
export class InsctiptionComponent {
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
}
