import { Component, Input, OnInit } from '@angular/core';
import { Actions } from 'src/app/enums/actions';
import { MESSAGES} from  'src/app/constants/success-messages';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-error-message',
    templateUrl: './error-message.component.html',
    styleUrls: ['./error-message.component.scss'],
    standalone: true
})
export class ErrorMessageComponent implements OnInit {
  @Input() eventData:any;

  eventType:any;
  elementName: any;
  errorMessage: string | undefined;
  showModal: boolean = false;

  constructor(private toastr:  ToastrService) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (typeof this.eventData !== 'undefined') {
      this.eventType = this.eventData.eventType;
      this.elementName = this.eventData.elementName;
      this.showModal = true;

      if (this.eventType == Actions.beginTask) {
        this.errorMessage = MESSAGES['beginTaskError'];
      } else if (this.eventType == Actions.completeTask) {
        this.errorMessage = MESSAGES['completeNotStartedTask'];
      } else if (this.eventType = Actions.addEmptyTag) {
        this.errorMessage = MESSAGES['addEmptyTag'];
      }
      this.toastr.error(this.errorMessage, 'Error');
    }
  }
}
