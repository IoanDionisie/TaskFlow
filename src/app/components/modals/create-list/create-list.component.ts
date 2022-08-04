import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenStorageService } from 'src/app/services/token-storage.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent  {

  @Output() createListConfirmation: EventEmitter<any> = new EventEmitter();
  
  name: string | undefined;
  description: string | undefined;

  
  constructor(private modal: NgbActiveModal, private token: TokenStorageService) {}
  
  confirm() {
    let list = {
      confirmation: true, 
      title: this.name,
      description: this.description
    }
    this.createListConfirmation.emit(list);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
}
