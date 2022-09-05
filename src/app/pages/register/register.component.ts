import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  submitted = false;
  working = false;
  complete = false;
  strongPassword = false;

  form: any = {
    username: null,
    email: null,
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ]),
  };
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,  private router: Router) { }
 
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
   
    this.authService.register(username, email, password).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['login'], {queryParams: { registered: 'true' } });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}