import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import * as global from 'src/app/constants/variables';
import { PasswordComponent } from '../../components/password/password.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [NgIf, FormsModule, PasswordComponent, RouterLink, NgxSpinnerModule],
})

export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  version = global.version;
  
  API_GOOGLE_URL = 'http://localhost:3000/api/auth/google';

  constructor(private facadeService: FacadeService,
    private router: Router) { }

  ngOnInit(): void {  
    if (this.facadeService.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.facadeService.showSpinner();
    let that = this;

    var loginTimer = setInterval(function() {
      that.facadeService.hideSpinner();
      that.facadeService.login(username, password).subscribe({
        next: data => {
          that.facadeService.saveToken(data.accessToken);
          that.facadeService.saveUser(data);
          that.isLoginFailed = false;
          that.isLoggedIn = true;
          that.router.navigate(['dashboard']);
        },
        error: err => {
          that.errorMessage = err.error.message;console.log(that.errorMessage);
          that.isLoginFailed = true;
        }
      });
      clearInterval(loginTimer);
    }, 1500);
  }

  reloadPage(): void {
    window.location.reload();
  }

  onLoginWithGoogle() {
    this.facadeService.loginWithGoogle();
  }
}