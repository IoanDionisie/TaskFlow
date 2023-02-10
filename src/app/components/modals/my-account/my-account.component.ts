import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Output, EventEmitter } from '@angular/core';
import { MESSAGES } from 'src/app/constants/success-messages';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { PasswordStrengthComponent } from '../../password-strength/password-strength.component';
import { FormsModule } from '@angular/forms';
import { FacadeService } from 'src/app/services/facade.service';

const API_URL = 'http://localhost:3000/api/';

@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.scss'],
    standalone: true,
    imports: [FormsModule, PasswordStrengthComponent, NgIf]
})

export class MyAccountComponent implements OnInit {
  complete = false;
  strongPassword = false;
  errorMessage = "";
  passwordError = "";
  uploadedFile: File | undefined;

  @Input() username: any;
  @Output() changedPassword = new EventEmitter<string>();
  @Output() changedProfilePicture = new EventEmitter<string>();
  
  form: any = {
    confirmPassword: null,
    username: null,
    password: null
  };

  constructor(private modal: NgbActiveModal, private facadeService: FacadeService, 
    private http: HttpClient) { }

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
      this.facadeService.changePassword(this.form.username, this.form.password).subscribe({
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

  fileChange(element: any) {
    this.uploadedFile = element.target.files[0];
  }

  uploadFile() {
    let formData = new FormData();
    if (this.uploadedFile) {
      formData.append("uploads", this.uploadedFile, this.uploadedFile.name);
      this.http.post(API_URL + 'upload', formData)
      .subscribe(() => {
        this.changedProfilePicture.emit();
        this.closeModal();
      })
    }
  }
}
