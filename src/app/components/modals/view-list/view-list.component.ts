import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import  Utils from '../../../utils/Utils';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss']
})
export class ViewListComponent implements OnInit {

  @Input() list: any;
  readonly ITEM_STATUS = ITEM_STATUS;

  dateCreated:  any;
  dateCompleted: any;

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.dateCreated = Utils.convertDate(new Date(this.list.dateCreated));
    this.dateCompleted = Utils.convertDate(new Date(this.list.dateCompleted));
  }

  closeModal() {
    this.modal.close();
  }

}
