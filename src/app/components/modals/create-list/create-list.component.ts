import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent  {

  @Output() createListConfirmation: EventEmitter<any> = new EventEmitter();
  
  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    this.createListConfirmation.emit(true);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
}
