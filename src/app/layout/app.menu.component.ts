import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Gestión de usuarios',
                items: [
                    { label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/pages/users'] }
                ]
            },
            {
                label: 'Proceso de titulación',
                items: [
                    { label: 'Proyecto de Tesis', icon: 'pi pi-fw pi-file', routerLink: ['/pages/inscription-tracking'] },
                    { label: 'Asesorías', icon: 'pi pi-fw pi-file-import', routerLink: ['/pages/asesorias'] },
                    { label: 'Revisión de tesis', icon: 'pi pi-fw pi-file-export', routerLink: ['/pages/'] },
                    { label: 'Sustentación', icon: 'pi pi-fw pi-copy', routerLink: ['/pages/'] },
                    { label: 'Obervaciones', icon: 'pi pi-fw pi-list', routerLink: ['/pages/'] },
                ]
            },
            {
                label: 'SEMILLERO',
                items: [
                    { label: 'Seguimiento', icon: 'pi pi-fw pi-book', routerLink: ['/pages/articulos-semilleros'] },
                ]
            },
            {
                label: 'Eventos',
                items: [
                    { label: 'Calendario', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/events'] },
                    { label: 'Reuniones UDI', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/events-udi'] },
                ]
            },
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
        ];
    }
}
