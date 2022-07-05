import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modify-item',
  templateUrl: './modify-item.component.html',
  styleUrls: ['./modify-item.component.scss']
})
export class ModifyItemComponent implements OnInit {

  @Input() public elementName: any;
  @Input() public title: string = "";
  @Input() public description: string = "";

  @Output() modifyItemConfirmation: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal) {}

  ngOnInit(): void {
  }

  confirm() {
    let obj = {
      confirmation: true, 
      title: this.title,
      description: this.description,
    }

    this.modifyItemConfirmation.emit(obj);
    this.closeModal();
  }

  
  closeModal() {
    this.modal.close();
  }

}
