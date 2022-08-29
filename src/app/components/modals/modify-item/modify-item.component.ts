import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { ITEM_TYPE } from 'src/app/constants/item-types';

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
  @Input() public tags: any;

  @Output() modifyItemConfirmation: EventEmitter<any> = new EventEmitter();

  readonly ITEM_STATUS = ITEM_STATUS;
  readonly ITEM_TYPE = ITEM_TYPE;

  constructor(private modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      status: this.status,
      observations: this.observations,
      tags: this.tags
    }

    this.modifyItemConfirmation.emit(obj);
    this.closeModal();
  }
  
  closeModal() {
    this.modal.close();
  }

  tagsAddedHandler(tags: string[]) {
    this.tags = [];

    for (let i = 0; i < tags.length; ++i) {
      this.tags?.push({title: tags[i]});
    }
  }
}
