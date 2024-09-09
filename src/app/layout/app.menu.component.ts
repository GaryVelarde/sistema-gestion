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
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/'] }
                ]
            },
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
                    { label: 'Revisión de tesis', icon: 'pi pi-fw pi-file-export', routerLink: ['/pages/a'] },
                    { label: 'Sustentación', icon: 'pi pi-fw pi-copy', routerLink: ['/pages/a'] },
                    { label: 'Obervaciones', icon: 'pi pi-fw pi-list', routerLink: ['/pages/a'] },
                ]
            },
            {
                label: 'SEMILLERO',
                items: [
                    { label: 'Artículos', icon: 'pi pi-fw pi-book', routerLink: ['/pages/articulos-semilleros'] },
                ]
            },
            {
                label: 'Eventos',
                items: [
                    { label: 'Calendario', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/events'] },
                    { label: 'Reuniones UDI', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/events-udi'] },
                ]
            },
        ];
    }

    getUserFullName(): string {
        const userName = JSON.parse(localStorage.getItem('dr2lp2'));
        return userName === null ? '-' : userName.user.name + ' ' + userName.user.surnames
    }

    getInitialName(): string {
        const userName = JSON.parse(localStorage.getItem('dr2lp2'));
        return userName === null ? '-' : this.getFirstLetter(userName.user.name);
    }

    getFirstLetter(str: string): string {
        if (!str) {
            console.error('The string is empty');
            return '';
        }
        const firstLetter = str.charAt(0);
        const firstLetterUpper = firstLetter.toUpperCase();
        return firstLetterUpper;
    }
}
