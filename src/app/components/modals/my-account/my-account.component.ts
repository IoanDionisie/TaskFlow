import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})

export class MyAccountComponent implements OnInit {

  submitted = false;
  working = false;
  complete = false;
  strongPassword = false;

  form: any = {
    confirmPassword: null,
    password: new FormControl(null, [
      Validators.minLength(8),
      Validators.required,
    ])
  };

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.form.confirmPassword = "";
  }

  closeModal() {
    this.modal.close();
  }

  
  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    this.working = true;

    const { password } = this.form;
  
  }

  onPasswordStrengthChanged(event: boolean) {
    console.log(this.form.password);
    this.strongPassword = event;
  }

}
