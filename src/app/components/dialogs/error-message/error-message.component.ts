import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Actions } from 'src/app/enums/actions';
import { ListActions } from 'src/app/enums/list-actions.model';
import { MESSAGES} from  'src/app/constants/success-messages';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent implements OnInit {
  @Input() eventData:any;

  eventType:any;
  elementName: any;
  errorMessage: string | undefined;
  showModal: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.eventData !== 'undefined') {
      this.eventType = this.eventData.eventType;
      this.elementName = this.eventData.elementName;

      if (this.eventType == Actions.beginTask) {
        this.showModal = true;
        this.errorMessage = MESSAGES['beginTaskError'];
      } else if (this.eventType == Actions.completeTask) {
        this.showModal = true;
        this.errorMessage = MESSAGES['completeNotStartedTask'];
      }
      this.setTimer();
    }
  }

  setTimer(): void {
    setTimeout(() =>{ 
      this.eventType = -1;
      this.showModal = false;
    }, 3000);
  }

}
