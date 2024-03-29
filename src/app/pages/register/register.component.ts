import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import * as global from 'src/app/constants/variables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProfilePictureComponent } from 'src/app/components/modals/add-profile-picture/add-profile-picture.component';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';
import { NgIf, NgClass } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, NgClass, PasswordStrengthComponent, RouterLink],
})
export class RegisterComponent implements OnInit {

  submitted = false;
  working = false;
  complete = false;
  strongPassword = false;

  form: any = {
    username: null,
    email: null,
    password: new UntypedFormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ]),
  };
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  version = global.version;

  constructor(private facadeService: FacadeService,  private router: Router,
    private modalService: NgbModal) { }
 
  ngOnInit(): void {
    this.form.password = "";
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.working = true;
    const { username, email, password } = this.form;
   
    this.facadeService.register(username, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.facadeService.saveToken(data.accessToken);
        this.facadeService.saveUser(data);
        this.openAddProfilePictureModal();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
  
  openAddProfilePictureModal() {
    const modalRef = this.modalService.open(AddProfilePictureComponent);
    modalRef.componentInstance.uploadImageConfirmation.subscribe((response: any) => {
      this.router.navigate(['dashboard']);
    })
  }
  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}