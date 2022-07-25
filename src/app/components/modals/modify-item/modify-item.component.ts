import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';

@Component({
  selector: 'app-modify-item',
  templateUrl: './modify-item.component.html',
  styleUrls: ['./modify-item.component.scss']
})
export class ModifyItemComponent implements OnInit {

  @Input() public elementName: any;
  @Input() public title: string = "";
  @Input() public description: string = "";
  @Input() public status: string = "";
  @Input() public observations: string = "";

  @Output() modifyItemConfirmation: EventEmitter<any> = new EventEmitter();

  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      status: this.status,
      observations: this.observations
    }

    this.modifyItemConfirmation.emit(obj);
    this.closeModal();
  }

  
  closeModal() {
    this.modal.close();
  }

}
