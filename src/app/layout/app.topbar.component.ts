import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
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
                }
            ]
        }
    ];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }
    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }
    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    constructor(public layoutService: LayoutService, private router: Router, private service: AuthService,
        private tokenService: TokenService,
    ) {
        this.validateScheme();
     }

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

    darMode() {
        this.changeTheme('md-dark-indigo', 'dark');
        this.validateScheme();
    }

    lightMode() {
        this.changeTheme('lara-light-indigo', 'light');
        this.validateScheme();
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    validateScheme() {
        if (this.colorScheme === 'light') {
            this.items[0].items[1] = {
                label: 'Modo oscuro',
                icon: 'pi pi-moon',
                command: () => {
                    this.darMode();
                }
            };
        } else {
            this.items[0].items[1] = {
                label: 'Modo claro',
                icon: 'pi pi-sun',
                command: () => {
                    this.lightMode();
                }
            };
        }

    }

}
