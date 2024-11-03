import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
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
        this.loaderService.show(true);
        const request: any = {
            email: this.email.value.trim(),
        }
        this.service.forgotPassword(request).pipe(
            finalize(() => {
                this.clearValues();
                this.loaderService.hide();
            })
        ).subscribe(
            (res: any) => {
                if (res.status) {
                    this.messageService.add({
                        key: 'tst',
                        severity: 'info',
                        summary: 'Confirmación',
                        detail: res.status,
                        life: 20000
                    });
                }
            }, (error) => {
                this.messageService.add({
                    key: 'tst',
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
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
