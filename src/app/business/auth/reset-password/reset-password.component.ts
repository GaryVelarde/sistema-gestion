import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/layout/service/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    valCheck: string[] = ['remember'];
    stateSecondPassword: string;
    token: string;
    emailUrl: string;
    private destroy$ = new Subject<void>();
    private _email: FormControl = new FormControl('', [Validators.required])
    private _password: FormControl = new FormControl('', [Validators.required])
    private _secondPassword: FormControl = new FormControl('', [Validators.required])

    get email() {
        return this._email;
    }
    get password() {
        return this._password;
    }
    get secondPassword() {
        return this._secondPassword;
    }

    constructor(private fb: FormBuilder, private service: AuthService,
        private messageService: MessageService, private router: Router,
        private loaderService: LoaderService, private tokenService: TokenService,
        private route: ActivatedRoute) {
        this.loginForm = this.fb.group({
            email: this.email,
            password: this.password,
            secondPassword: this.secondPassword,
        });
    }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.token = params.get('token')!;
            this.emailUrl = params.get('email')!;
            console.log(`Token: ${this.token}, emailUrl: ${this.emailUrl}`);
        });
        if (!this.token || this.token === null || !this.emailUrl || this.emailUrl === null) {
            this.router.navigate(['/auth/login']);
            return;
        }
        this.email.setValue(this.emailUrl);
        localStorage.removeItem('dr2lp2');
        this.watchSecondPassword();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    callToResetPassword() {
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
        this.service.resetPassword(request, this.token).pipe(
            finalize(() => {
                this.clearValues();
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res) {
                    this.router.navigate(['/auth/login']);
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

    watchSecondPassword(): void {
        this.secondPassword.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => {
            console.log('value', value)

            if (value) {
                value === this.password.value ? this.stateSecondPassword = ''
                    : this.stateSecondPassword = 'error';
            }
        })
    }
}
