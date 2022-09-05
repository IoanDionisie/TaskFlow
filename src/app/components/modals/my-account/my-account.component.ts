import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})

export class MyAccountComponent implements OnInit {
  complete = false;
  strongPassword = false;
  errorMessage = "";
  
  @Input() public username: any;

  form: any = {
    confirmPassword: null,
    username: null,
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ])
  };

  constructor(private modal: NgbActiveModal, private authService: AuthService) { }

  ngOnInit(): void {
    this.form.password = "";
    this.form.confirmPassword = "";
  }

  closeModal() {
    this.modal.close();
  }

  onSubmit(): void {
    this.form.username = this.username;
    this.authService.changePassword(this.form.username, this.form.password).subscribe({
      next: () => {
        console.log("Changed password successfully!");
      },
      error: (err: { error: { message: any; }; }) => {
        console.log(err.error)
        this.errorMessage = err.error.message;
      }
    });
  }

  onPasswordStrengthChanged(event: boolean) {
    this.strongPassword = event;
  }
}
