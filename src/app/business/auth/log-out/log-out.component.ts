import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent {

  constructor(private service: AuthService, private tokenService: TokenService, private router: Router) { }

  logOut() {
    this.service.closeSession().pipe().subscribe(
      (res) => {
        this.tokenService.revokeDR2LP2();
        this.tokenService.revokeToken();
      }, (error) => {
        this.tokenService.revokeDR2LP2();
        this.tokenService.revokeToken();
      });
  }

}
