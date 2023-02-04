import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  showPassword: boolean = true;
  
  @Input() form: any;
  @Input() fSubmitted: any;

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
