import { T } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { HelperService } from 'src/app/services/helper.service';
import { DisplayTagsComponent } from '../../display-tags/display-tags.component';
import { NgIf } from '@angular/common';


@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.scss'],
    standalone: true,
    imports: [NgIf, DisplayTagsComponent]
})
export class ViewTaskComponent implements OnInit {
  @Input() task: any;
  readonly ITEM_STATUS = ITEM_STATUS;

  dateCreated:  any;
  dateCompleted: any;
  workingTime: any;
  description: string
  observations: string;
  estimation: number;

  constructor(private modal: NgbActiveModal, private helperService: HelperService) { 
    this.description = '';
    this.observations = '';
    this.estimation = 0;
  }

  ngOnInit(): void {
    this.dateCreated = this.helperService.convertDate(new Date(this.task.dateCreated));
    this.dateCompleted = this.helperService.convertDate(new Date(this.task.dateCompleted));
    if (this.task.totalWorkingTime == 0) {
      this.workingTime = this.helperService.secondsToHoursMinutesSeconds(this.helperService.getSecondsDiff(new Date(this.task.dateCreated), new Date(this.task.dateCompleted)));
    } else {
      this.workingTime = this.helperService.secondsToHoursMinutesSeconds(this.task.totalWorkingTime);
    }

    if (this.task.description) {
      this.description = this.helperService.linkifyText(this.task.description);
    }
    if (this.task.observations) {
      this.observations =  this.helperService.linkifyText(this.task.observations);
    }

    if (this.task.estimation) {
      this.estimation = this.task.estimation;
    }

  }

  closeModal() {
    this.modal.close();
  }
}
