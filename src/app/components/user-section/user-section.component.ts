import { NgClass } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MyAccountComponent } from "../modals/my-account/my-account.component";
import { FacadeService } from "src/app/services/facade.service";
import { NgbModal, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-section',
  templateUrl: './user-section.component.html',
  styleUrls: ['./user-section.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, NgClass, NgbDropdown, NgbDropdownToggle,
    NgbDropdownMenu]
})

export class UserSectionComponent implements OnInit {
  profilePicture: any;
  userName: string = "";
  tutorialStep: number = -1;

  constructor(private modalService: NgbModal, private facadeService: FacadeService) {

  }

  ngOnInit(): void {

  }

  openAccountModal() {
    const modalRef = this.modalService.open(MyAccountComponent);
    modalRef.componentInstance.username = this.userName;

    modalRef.componentInstance.changedPassword.subscribe(() => {
      this.showSuccessMessage(Actions.changedPassword, null);
    })

    modalRef.componentInstance.changedProfilePicture.subscribe((data: any) => {
      this.showSuccessMessage(Actions.changeProfilePicture, null);
      this.setProfilePicture = this.imageService.profilePicture$.subscribe(response => {
        this.profilePicture = response;
      })
    });
  }

  showTagsList() {
    const modalRef = this.modalService.open(TagsListComponent);
    modalRef.componentInstance.showMessage.subscribe((receivedData: any) => {
        this.showSuccessMessage(receivedData.message, receivedData.tagName);
        if (receivedData.refresh) {
          this.ngOnInit();
        }
    });
  }

  logOut() {
    this.facadeService.showSpinner();
    var logoutInterval = setInterval(() => {
      this.facadeService.signOut();
      this.facadeService.hideSpinner();
      clearInterval(logoutInterval);
    }, 1500);
  }

  showSettings() {
    const modalRef = this.modalService.open(SettingsComponent);
    modalRef.componentInstance.tutorialStep = this.tutorialStep;
    modalRef.componentInstance.showMessage.subscribe((receivedData: any) => {
      this.showSuccessMessage(receivedData.message, receivedData.tagName);
      if (receivedData.message == Actions.importData) {
        this.ngOnInit();
      } else if (receivedData.message == Actions.addTagTutorial) {
        this.tutorialStep = 3;
        this.tutorialStepText = TUTORIAL_STEPS.createTask;
      }
    })
  }

}
