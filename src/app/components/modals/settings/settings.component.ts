import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from 'src/app/enums/actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit  {
  errorEventData: Object | undefined;

  tagName: string = "";
  tagColor: string = "";

  showEmptyTagError: boolean  = false;
  showTagLengthError: boolean = false;

  @Output() showMessage: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal) { }
  
  ngOnInit(): void {
    this.tagColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    console.log(this.tagColor);
  }

  closeModal() {
    this.modal.close();
  }

  addTag() {
    this.showEmptyTagError = false;
    this.showTagLengthError = false;

    if (this.tagName == "") {
      this.showEmptyTagError = true;
    } else if (this.tagName.length < 3) {
      this.showTagLengthError = true
    } else {
      this.closeModal();
      let data = {
        tagName: this.tagName,
        message: Actions.addTag
      }

      // Backend part TODO

      this.showMessage.emit(data);
    }
  }
}
