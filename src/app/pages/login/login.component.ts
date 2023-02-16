import { Component, OnInit } from '@angular/core';
import * as global from 'src/app/constants/variables';
import { PasswordComponent } from '../../components/password/password.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, PasswordComponent, RouterLink],
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
    this.facadeService.login(username, password).subscribe({
      next: data => {
        this.facadeService.saveToken(data.accessToken);
        this.facadeService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate(['dashboard']);
      },
      error: err => {
        this.errorMessage = err.error.message;console.log(this.errorMessage);
        this.isLoginFailed = true;
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }

  onLoginWithGoogle() {
    this.facadeService.loginWithGoogle();
  }
}