import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TokenService } from 'src/app/services/token.service';
import { ProfileService } from './commons/services/profile.service';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService],
})

export class ProfileComponent implements OnInit {
  user: any;
  statusCallUser = false;
  edition = false;
  changePassStatus = 'pi pi-save';
  statusUpdate = 'pi pi-save';
  userForm: FormGroup;
  changePasswordForm: FormGroup;

  private _id = new FormControl({ value: '', disabled: true });
  private _role = new FormControl('', [Validators.required]);
  private _name = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  private _surnames = new FormControl('', [Validators.required, Validators.maxLength(50)]);
  private _phone = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]);
  private _code = new FormControl('', [Validators.required]);
  private _dischargeDate = new FormControl('');
  private _cycle = new FormControl('');
  private _career = new FormControl('', [Validators.maxLength(100)]);
  private _line = new FormControl('', [Validators.maxLength(100)]);
  private _sublines = new FormControl('', [Validators.maxLength(100)]);
  private _isReviewer = new FormControl(0);
  private _isAdvisor = new FormControl(0);
  private _isJury = new FormControl(0);
  private _orcid = new FormControl('');
  private _cip = new FormControl('');
  private _status = new FormControl('', [Validators.required]);
  private _emailVerifiedAt = new FormControl('');
  private _oldPassword = new FormControl('', [Validators.required]);
  private _newPassword = new FormControl('', [Validators.required]);
  private _repeatNewPassword = new FormControl('', [Validators.required, this.matchPasswordValidator()]);

  get id() {
    return this._id;
  }
  get role() {
    return this._role;
  }
  get name() {
    return this._name;
  }
  get surnames() {
    return this._surnames;
  }
  get phone() {
    return this._phone;
  }
  get code() {
    return this._code;
  }
  get dischargeDate() {
    return this._dischargeDate;
  }
  get cycle() {
    return this._cycle;
  }
  get career() {
    return this._career;
  }
  get line() {
    return this._line;
  }
  get sublines() {
    return this._sublines;
  }
  get isReviewer() {
    return this._isReviewer;
  }
  get isAdvisor() {
    return this._isAdvisor;
  }
  get isJury() {
    return this._isJury;
  }
  get orcid() {
    return this._orcid;
  }
  get cip() {
    return this._cip;
  }
  get status() {
    return this._status;
  }
  get emailVerifiedAt() {
    return this._emailVerifiedAt;
  }
  get oldPassword() {
    return this._oldPassword;
  }
  get newPassword() {
    return this._newPassword;
  }
  get repeatNewPassword() {
    return this._repeatNewPassword;
  }

  constructor(
    private service: ProfileService,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.userForm = this.fb.group({
      id: this.id,
      role: this.role,
      name: this.name,
      surnames: this.surnames,
      phone: this.phone,
      code: this.code,
      discharge_date: this.dischargeDate,
      cycle: this.cycle,
      career: this.career,
      line: this.line,
      sublines: this.sublines,
      is_reviewer: this.isReviewer,
      is_advisor: this.isAdvisor,
      is_jury: this.isJury,
      orcid: this.orcid,
      cip: this.cip,
    });
    this.changePasswordForm = this.fb.group({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      repeatNewPassword: this.repeatNewPassword,
    });
  }

  ngOnInit() {
    this.callGetUserById();
  }

  callGetUserById() {
    this.statusCallUser = false;
    const userId = this.tokenService.getDR2LP2().user.id;
    if (userId) {
      this.service.getUserById(userId).pipe().
        subscribe(
          (res: any) => {
            if (res.status) {
              this.user = res.user;
              this.statusCallUser = true;
            }
          }, (error) => {
            this.statusCallUser = false;
          })
    }
  }

  showEdition() {
    this.fillFormEdition();
    this.edition = true;
  }

  cancelEdition() {
    this.edition = false;
  }

  fillFormEdition() {
    this.name.setValue(this.user.name);
    this.surnames.setValue(this.user.surnames);
    this.phone.setValue(this.user.phone);
    this.career.setValue(this.user.career);
    this.line.setValue(this.user.line);
    this.line.setValue(this.user.line);
    this.sublines.setValue(this.user.sublines);
    this.orcid.setValue(this.user.orcid || '-');
    this.cip.setValue(this.user.cip || '-');
  }

  saveEdition() {
    this.statusUpdate = 'pi pi-spin pi-spinner';
    const request = this.generateRequest();
    this.service.putUserUpdate(request, this.user.id).pipe(
      finalize(() => {
        this.statusUpdate = 'pi pi-save';
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.updateUserDate();
          this.edition = false;
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'Los datos se han actualizado.',
            life: 3000,
          });
        }
      }, (error) => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error',
          detail: 'Se ha producido un error al actualizar la información.',
          life: 3000,
        });
      })
  }

  updateUserDate() {
    this.user.name = this.name.value;
    this.user.surnames = this.surnames.value;
    this.user.phone = this.phone.value;
    this.user.career = this.career.value;
    this.user.line = this.line.value;
    this.user.sublines = this.sublines.value;
    this.user.orcid = this.orcid.value;
    this.user.cip = this.cip.value;
    this.edition = false;
  }

  private matchPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const newPassword = this.newPassword.value;
      const repeatNewPassword = control.value;

      if (newPassword !== repeatNewPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  generateRequest() {
    return this.user.role === 'UDI' ? {
      role: 'UDI',
      name: this.name.value,
      surnames: this.surnames.value,
      phone: this.phone.value,
      email: this.user.email,
    } : {
      role: 'Docente',
      name: this.name.value,
      surnames: this.surnames.value,
      phone: this.phone.value,
      email: this.user.email,
      career: this.career.value,
      line: this.line.value,
      sublines: this.sublines.value,
      orcid: this.orcid.value,
      cip: this.cip.value,
    };
  }

  resetPassword() {
    this.changePassStatus = 'pi pi-spin pi-spinner';
    const request = {
      current_password: this.oldPassword.value,
      password: this.newPassword.value,
      password_confirmation: this.repeatNewPassword.value
    }
    this.service.postResetPassword(request, this.user.id).pipe(
      finalize(() => {
        this.changePassStatus = 'pi pi-save';
      })
    ).
      subscribe((res: any) => {
        if (res.status) {
          this.changePasswordForm.reset();
          this.messageService.add({
            key: 'tst',
            severity: 'info',
            summary: 'Confirmación',
            detail: 'La contraseña se ha cambiado.',
            life: 3000,
          });
        }
      }, (error) => {
        if (error.error.message) {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
            life: 3000,
          });
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error',
            detail: 'Se ha producido un error al actualizar la información.',
            life: 3000,
          });
        }

      })
  }

}
