import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[] = [
        {
            label: 'Opciones',
            items: [
                {
                    label: 'Cerrar sesión',
                    icon: 'pi pi-sign-out',
                    command: () => {
                        this.logOut();
                    }

                },
            ]
        }
    ];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private router: Router, private service: AuthService,
        private tokenService: TokenService,
    ) { }

    getInitialName(): string {
        const userName = this.tokenService.getDR2LP2();
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

    logOut() {
        this.service.closeSession().pipe().subscribe(
            (res) => {
                this.tokenService.revokeDR2LP2();
                this.tokenService.revokeToken();
            }, (error) => {
                this.tokenService.revokeDR2LP2();
                this.tokenService.revokeToken();
            });
        this.router.navigate(['/auth/login']);
    }

}
