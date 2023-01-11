import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { HelperService } from 'src/app/services/helper.service';

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

  constructor(private modal: NgbActiveModal, private helperService: HelperService) { }

  ngOnInit(): void {
    this.dateCreated = this.helperService.convertDate(new Date(this.list.dateCreated));
    this.dateCompleted = this.helperService.convertDate(new Date(this.list.dateCompleted));

    if (this.list.description) {
      this.list.description = this.helperService.linkifyText(this.list.description);
    }

    if (this.list.observations) {
      this.list.observations =  this.helperService.linkifyText(this.list.observations);
    }
  }

  closeModal() {
    this.modal.close();
  }

}
