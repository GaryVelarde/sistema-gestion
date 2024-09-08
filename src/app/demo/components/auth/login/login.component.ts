import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthCredentials } from 'src/app/models/auth-credentials.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    valCheck: string[] = ['remember'];

    private _email: FormControl = new FormControl('', [Validators.required])
    private _password: FormControl = new FormControl('', [Validators.required])

    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    constructor(private fb: FormBuilder, private service: AuthService,
        private messageService: MessageService, private router: Router,
        private loaderService: LoaderService) {
        this.loginForm = this.fb.group({
            email: this.email,
            password: this.password,
        });
    }

    ngOnInit(): void {
        localStorage.removeItem('dr2lp2');
    }

    callToLogin() {
        this.loaderService.show();
        const request: AuthCredentials = {
            email: this.email.value,
            password: this.password.value
        }
        this.service.login(request).pipe(
            finalize(() => {
                this.clearValues(); 
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res) {
                    localStorage.setItem('dr2lp2', JSON.stringify(res));
                    localStorage.setItem('access_token', res.token);
                    this.router.navigate(['/']);
                }
                console.log(res);
            }, (error) => {
                console.log(error)
                let msg = '';
                switch (error.error.message) {
                    case 'Unauthorized':
                        msg = 'El usuario y/o la contraseña son incorrectos.';
                        break;
                    case 'El valor seleccionado email no es válido.':
                        msg = 'El usuario y/o la contraseña son incorrectos.';
                        break;
                    default:
                        msg = error.error.message;
                }
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: msg,
                    life: 7000,
                });
            })
    }

    clearValues() {
        this.password.reset();
    }

}
