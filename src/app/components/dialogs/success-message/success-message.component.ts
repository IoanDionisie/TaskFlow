import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Actions } from 'src/app/enums/actions';
import { ListActions } from 'src/app/enums/list-actions.model';
import { MESSAGES} from  'src/app/constants/success-messages';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent implements OnInit {

  @Input() eventData:any;

  eventType:any;
  elementName: any;
  successMessage: string | undefined;
  showModal: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.eventData !== 'undefined') {
      this.eventType = this.eventData.eventType;
      this.elementName = this.eventData.elementName;
  
      if (this.eventType != -1 )  {
        this.showModal = true;
        this.successMessage = '"' + this.elementName + '"';
  
        if (this.eventType == Actions.addList || this.eventType == Actions.addTask) {
          this.successMessage += MESSAGES['addItem'];
        } else if (this.eventType == Actions.deleteList || this.eventType == Actions.deleteTask) {
          this.successMessage += MESSAGES['deleteItem'];
        } else  if (this.eventType == Actions.modifyList || this.eventType == Actions.modifyTask) {
          this.successMessage += MESSAGES['modifyItem'];
        } else if (this.eventType == Actions.completeList || this.eventType == Actions.completeTask) {
          this.successMessage += MESSAGES['completeItem'];
        } else if (this.eventType == Actions.beginTask) {
          this.successMessage = "";
          this.successMessage += MESSAGES['beginTask'] + " " + this.elementName;
        } else if (this.eventType == Actions.changedPassword) {
          this.successMessage = MESSAGES['changedPassword'];
        }
  
        this.setTimer();
      }
    }
  }

  setTimer(): void {
    setTimeout(() =>{ 
      this.eventType = -1;
      this.showModal = false;
    }, 3000);
  }
}
