import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf]
})
export class PasswordComponent {
  showPassword: boolean = true;
  
  @Input() form: any;
  @Input() fSubmitted: any;

  changeShowPassword() {
    this.showPassword = !this.showPassword;
  }

}
