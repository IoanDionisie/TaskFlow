import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from 'src/app/enums/actions';
import { TaskService } from 'src/app/services/task.service';

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

  constructor(private modal: NgbActiveModal, private taskService: TaskService,
    private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
    this.tagColor = "#" + Math.floor(Math.random()*16777215).toString(16);
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
      let tag = {
        title: this.tagName,
        color: this.tagColor
      }

      this.taskService.createTag(tag).subscribe((response: any) => { 

        let showMessageData = {
          tagName: this.tagName,
          message: Actions.addTag
        }

        this.showMessage.emit(showMessageData);
        this.closeModal();
      }); 
    }
  }

  exportData() {
    this.taskService.getDataForExport().subscribe(response => {
      var element = document.createElement('a');
      var jsonElem = JSON.stringify(response);
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(jsonElem));
      element.setAttribute('download', "TaskFlowData.json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }

  importData() {

  }
  
}
