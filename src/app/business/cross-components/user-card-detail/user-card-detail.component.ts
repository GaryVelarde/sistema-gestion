import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-user-card-detail',
  templateUrl: './user-card-detail.component.html',
  styleUrls: ['./user-card-detail.component.scss']
})
export class UserCardDetailComponent implements OnInit {

  constructor(private tokenService: TokenService) { }

  ngOnInit() {
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


}
