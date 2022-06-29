import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent  {

  @Output() createListConfirmation: EventEmitter<any> = new EventEmitter();
  
  name: string | undefined;
  description: string | undefined;

  
  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    let obj = {
      confirmation: true, 
      title: this.name,
      description: this.description
    }

    this.createListConfirmation.emit(obj);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
}
