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
  @Input() public estimation: any;

  @Output() modifyItemConfirmation: EventEmitter<any> = new EventEmitter();

  timeValues: number[];

  readonly ITEM_STATUS = ITEM_STATUS;
  readonly ITEM_TYPE = ITEM_TYPE;

  constructor(private modal: NgbActiveModal) {
    this.timeValues = [];
  }

  ngOnInit(): void {
    for (let i = 1; i < 13; ++i) {
      this.timeValues.push(i/2);
    }
    console.log(this.estimation)
  }

  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
      status: this.status,
      observations: this.observations,
      tags: this.tags,
      estimation: this.estimation
    }

    this.modifyItemConfirmation.emit(obj);
    this.closeModal();
  }
  
  closeModal() {
    this.modal.close();
  }

  tagsAddedHandler(tags: any) {
    this.tags = [];

    for (let i = 0; i < tags.length; ++i) {
      if (tags[i].title == null || typeof tags[i].title == 'undefined') {
        let color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.tags?.push({title: tags[i], color: color});
      } else {
        this.tags?.push(tags[i]);
      }
    }
  }

  pickEstimation(value: number) {
    this.estimation = value;
  }
}
