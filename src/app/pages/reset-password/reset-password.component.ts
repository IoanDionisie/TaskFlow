import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  form: any = {
    email: null
  };

  submitted = false;
  mailSent: boolean = false;
  mailError: string = "";

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {  
    this.mailSent = false;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit () {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    
    this.authService.resetPassword(this.form.email).subscribe({
      next: () => {
        this.mailSent = true;
      },
      error: (err: { error: { message: any; }; }) => {
       this.mailError = err.error.message;
      }
    });
  }
}
