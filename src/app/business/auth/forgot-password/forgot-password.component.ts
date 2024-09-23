import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ForgotPasswordComponent implements OnInit {

    loginForm: FormGroup;

    valCheck: string[] = ['remember'];

    private _email: FormControl = new FormControl('', [Validators.required])

    get email() {
        return this._email;
    }

    constructor(private fb: FormBuilder, private service: AuthService,
        private messageService: MessageService, private router: Router,
        private loaderService: LoaderService, private tokenService: TokenService) {
        this.loginForm = this.fb.group({
            email: this.email,
        });
    }

    ngOnInit(): void {
        localStorage.removeItem('dr2lp2');
    }

    callToForgotPassword() {
        if (!this.email.valid) {
            this.messageService.add({
                key: 'tst',
                severity: 'warn',
                summary: 'Alerta',
                detail: '    ingresar un correo para continuar',
                life: 7000,
            });
            return;
        }
        this.loaderService.show();
        const request: any = {
            email: this.email.value,
        }
        this.service.forgotPassword(request).pipe(
            finalize(() => {
                this.clearValues();
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res) {
                    //mostrar alerta indicando que se la ha enviado un link a su correo
                }
                console.log(res);
            }, (error) => {
                console.log(error)
                let msg = '';
                switch (error.error.message) {
                    case 'Record not found.':
                        msg = 'El correo ingresado no está registrado.';
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
        this.email.reset();
    }

    redirectToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
