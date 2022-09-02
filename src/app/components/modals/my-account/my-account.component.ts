import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.close();
  }

}
