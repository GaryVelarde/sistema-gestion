import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { TokenService } from '../services/token.service';
import { teacherOptions, udiOptions } from '../commons/constants/app.constants';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService, private tokenService: TokenService) { }

    ngOnInit() {
        this.model = this.tokenService.userIsUDI() ? udiOptions : teacherOptions;
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
