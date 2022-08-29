import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {

  @Input() task: any;
  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.close();
  }

}
