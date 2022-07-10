import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})

export class DeleteItemComponent  { 


  @Input() public elementName: any;
  @Output() removeConfirmation: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal) {}
  
  removeItem(remove: boolean) {
    this.removeConfirmation.emit(remove);   
    this.closeModal();
  }

  closeModal() {
    this.modal.close();
  }
  
}
