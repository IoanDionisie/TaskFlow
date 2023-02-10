import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-new-password',
    templateUrl: './new-password.component.html',
    styleUrls: ['./new-password.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, RouterLink]
})
export class NewPasswordComponent {
  form: any = {
    email: null
  };

  submitted = false;
  queryParams: any;
  passwordLengthError: boolean = false;
  passwordMatchError: boolean = false;
  passwordChanged: boolean = false;

  constructor(private facadeService: FacadeService,
    private activateRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.queryParams  = this.activateRoute.snapshot.queryParams;
    this.facadeService.checkResetPasswordLink(this.queryParams).subscribe({
     next: (response: any) => {
      this.form.email = response['email'];
     },
      error: (err: { error: { message: any; }; }) => {
        this.router.navigate(['resetPassword']);
      }
    });
  }
  
  changePassword() {
    
  }
  
  onSubmit() {
    var email = this.form.email;
    this.submitted = true;
    this.passwordLengthError = false;
    this.passwordMatchError = false;

    if (this.form.password.length < 8) {
      this.passwordLengthError = true;
    } else if (this.form.password == this.form.confirmPassword) {
      this.facadeService.changePasswordUsingMail(email, this.form.password).subscribe({
        next: () => {
          this.passwordChanged = true;
        },
        error: (err: { error: { message: any; }; }) => {
          console.log(err.error.message);
        }
      });
    } else {
      this.passwordMatchError = true;
    }
  }

}
