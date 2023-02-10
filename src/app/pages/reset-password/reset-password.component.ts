import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, RouterLink],
})
export class ResetPasswordComponent {
  form: any = {
    email: null
  };

  submitted = false;
  mailSent: boolean = false;
  mailError: string = "";

  constructor(private facadeService: FacadeService) {
  }

  ngOnInit(): void {  
    this.mailSent = false;
  }

  get f() {
    return this.form.controls;
  }

  onSubmit () {
    this.submitted = true;
 
    this.facadeService.resetPassword(this.form.email).subscribe({
      next: () => {
        this.mailSent = true;
      },
      error: (err: { error: { message: any; }; }) => {
       this.mailError = err.error.message;
      }
    });
  }
}
