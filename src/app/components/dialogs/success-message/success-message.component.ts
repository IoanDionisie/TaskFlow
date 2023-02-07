import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Actions } from 'src/app/enums/actions';
import { ListActions } from 'src/app/enums/list-actions.model';
import { MESSAGES} from  'src/app/constants/success-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.scss']
})
export class SuccessMessageComponent {

  @Input() eventData:any;

  eventType:any;
  elementName: any;
  successMessage: string | undefined;
  showModal: boolean = false;

  constructor(private toastr:  ToastrService) { }

  ngOnChanges(): void {
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
          this.successMessage += MESSAGES['beginTask'] + " " + '"' +  this.elementName + '"';
        } else if (this.eventType == Actions.changedPassword) {
          this.successMessage = MESSAGES['changedPassword'];
        } else if (this.eventType == Actions.addTag) {
          this.successMessage = "Tag " + this.elementName + MESSAGES['addItem'];
        } else  if (this.eventType == Actions.resumeTask) {
          this.successMessage = "";
          this.successMessage += MESSAGES['resumeTask'];
        } else if (this.eventType == Actions.pauseTask) {
          this.successMessage = "";
          this.successMessage += MESSAGES['pauseTask'];
        } else if (this.eventType == Actions.changeProfilePicture) {
          this.successMessage = "";
          this.successMessage += MESSAGES['changeProfilePicture'];
        } else if (this.eventType == Actions.cloneTask) {
          this.successMessage = "";
          this.successMessage += MESSAGES['cloneTask'];
        } else if (this.eventType == Actions.removeTag) {
          this.successMessage = "Tag " + this.elementName + MESSAGES['deleteItem']
        } else if (this.eventType == Actions.importData) {
          this.successMessage = MESSAGES['importData'];
        } else if (this.eventType == Actions.exportData) {
          this.successMessage = MESSAGES['exportData'];
        } else if (this.eventType == Actions.removeTags) {
          this.successMessage = MESSAGES['removeTags'];
        } else if (this.eventType == Actions.changeTagColor) {
          this.successMessage = "Tag " + this.elementName + MESSAGES['modifyItem'];
        }
      }
      this.toastr.success(this.successMessage, 'Success');
    }

  }

}
