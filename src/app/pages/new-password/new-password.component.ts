import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent {
  form: any = {
    email: null
  };

  constructor(private authService: AuthService, private token: TokenStorageService) { }

  
  changePassword() {

  }
  
  onSubmit() {
    var username = this.token.getUser().username;
    this.authService.changePassword(username, this.form.password).subscribe({
      next: () => {
      },
      error: (err: { error: { message: any; }; }) => {
        console.log(err.error.message)
      }
    });
  }

}
