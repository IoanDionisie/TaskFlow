import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-create-list',
    templateUrl: './create-list.component.html',
    styleUrls: ['./create-list.component.scss'],
    standalone: true,
    imports: [FormsModule, AutosizeModule]
})
export class CreateListComponent  {

  @Output() createListConfirmation: EventEmitter<any> = new EventEmitter();
  
  name: string | undefined;
  description: string | undefined;

  
  constructor(private modal: NgbActiveModal) {}
  
  confirm() {
    let list = {
      confirmation: true, 
      title: this.name,
      description: this.description,
      dateCreated: new Date()
    }
    this.createListConfirmation.emit(list);
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
}
