import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from '../../services/token-storage.service';
import * as global from 'src/app/constants/variables';
import { PasswordComponent } from '../../components/password/password.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [NgIf, FormsModule, PasswordComponent, RouterLink]
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

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['dashboard']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
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
    this.authService.loginWithGoogle();
  }
}