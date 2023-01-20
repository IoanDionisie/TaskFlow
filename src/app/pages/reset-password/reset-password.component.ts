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

  constructor(private authService: AuthService) {

  }

  onSubmit () {
    this.authService.resetPassword(this.form.email).subscribe({
      next: () => {
        console.log("Password reset email sent");
      },
      error: (err: { error: { message: any; }; }) => {
        console.log(err.error.message)
      }
    });
  }
}
