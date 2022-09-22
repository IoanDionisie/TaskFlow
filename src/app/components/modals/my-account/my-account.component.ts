import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Output, EventEmitter } from '@angular/core';
import { MESSAGES } from 'src/app/constants/success-messages';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})

export class MyAccountComponent implements OnInit {
  complete = false;
  strongPassword = false;
  errorMessage = "";
  passwordError = "";
  
  @Input() username: any;
  @Output() changedPassword = new EventEmitter<string>();

  form: any = {
    confirmPassword: null,
    username: null,
    password: null
  };

  constructor(private modal: NgbActiveModal, private authService: AuthService) { }

  ngOnInit(): void {
    this.form.password = "";
    this.form.confirmPassword = "";
  }

  closeModal() {
    this.modal.close();
  }

  onSubmit(): void {
    this.form.username = this.username;
    if (this.form.password != this.form.confirmPassword) {
      this.passwordError = MESSAGES["passwordNotMatching"];
    } else if (this.form.password.length < 8) {
      this.passwordError = MESSAGES["passwordTooShort"];
    } else {
      this.authService.changePassword(this.form.username, this.form.password).subscribe({
        next: () => {
          this.closeModal();
          this.changedPassword.emit();
        },
        error: (err: { error: { message: any; }; }) => {
          this.errorMessage = err.error.message;
        }
      });
    }
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}