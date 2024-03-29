import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from 'src/app/enums/actions';
import { NgStyle, NgIf } from '@angular/common';
import { ChangeThemeComponent } from '../../change-theme/change-theme.component';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [ChangeThemeComponent, NgStyle, NgIf]
})

export class SettingsComponent implements OnInit  {
  errorEventData: Object | undefined;

  tagName: string = "";
  tagColor: string = "";

  messageData = {};

  showEmptyTagError: boolean  = false;
  showTagLengthError: boolean = false;

  exportDisabled: boolean = true;

  loadedData: JSON | undefined;

  @Input() tutorialStep: number = -1;

  @Output() showMessage: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal, private facadeService: FacadeService) { }
  
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

      this.facadeService.createTag(tag).subscribe({ 
        next: resp => {
          if (this.tutorialStep == 2) {
            this.messageData = {
              tagName: this.tagName,
              message: Actions.addTagTutorial
            }
          } else {
            this.messageData = {
              tagName: this.tagName,
              message: Actions.addTag
            }
          }

          this.showMessage.emit(this.messageData);
          this.closeModal();
        },
        error: error => {
          console.log(error);
        }
      }); 
    }
  }

  exportData() {
    this.facadeService.getDataForExport().subscribe(response => {
      var element = document.createElement('a');
      var jsonElem = JSON.stringify(response);
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(jsonElem));
      element.setAttribute('download', "TaskFlowData.json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      this.messageData = {
        message: Actions.exportData
      }

      this.showMessage.emit(this.messageData);
      this.closeModal(); 
    });
  }

  importFile(fileList: any) {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    var result;
    fileReader.onloadend = function(x) {
      result = fileReader.result;
    }
    fileReader.readAsText(file);
  }

  loadData(files: any) {
    var reader = new FileReader();
    var file = files[0];
    let self = this;

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        try {
          if (e.target != null && e.target.result != null)  {
            self.loadedData = JSON.parse(e.target.result as string);
          }
        } catch (ex) {
          alert('ex when trying to parse json = ' + ex);
        }
      }
    })(file);

    reader.onloadend = (function() {
      self.exportDisabled = false;
    });

    reader.readAsText(file);
  }

  importLoadedData() {
    this.facadeService.importData(this.loadedData).subscribe(response => {

      this.messageData = {
        message: Actions.importData
      }
      this.showMessage.emit(this.messageData);
      this.closeModal();
    });
  }

  removeTags() {
    this.facadeService.removeTags().subscribe(response => {
      this.messageData = {
        message: Actions.removeTags
      }
      this.showMessage.emit(this.messageData);
      this.closeModal();
    });
  }
  
}
