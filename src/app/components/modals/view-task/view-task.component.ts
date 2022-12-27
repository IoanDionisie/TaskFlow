import { T } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { HelperService } from 'src/app/services/helper.service';
import Utils from '../../../utils/Utils';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {
  @Input() task: any;
  readonly ITEM_STATUS = ITEM_STATUS;

  dateCreated:  any;
  dateCompleted: any;
  workingTime: any;

  constructor(private modal: NgbActiveModal, private helperService: HelperService) { }

  ngOnInit(): void {
    this.dateCreated = Utils.convertDate(new Date(this.task.dateCreated));
    this.dateCompleted = Utils.convertDate(new Date(this.task.dateCompleted));
    console.log(this.task.lastDateStarted, this.task.dateStarted);
    let dateStarted = this.task.lastDateStarted ? this.task.lastDateStarted : this.task.dateStarted;
    this.workingTime = this.helperService.secondsToHoursMinutesSeconds(this.task.pastWorkingTime + this.helperService.getSecondsDiff(dateStarted, this.task.dateCompleted));
  }

  closeModal() {
    this.modal.close();
  }
}
