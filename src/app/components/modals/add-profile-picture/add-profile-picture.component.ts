import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const API_URL = 'http://localhost:3000/api/';

@Component({
  selector: 'app-add-profile-picture',
  templateUrl: './add-profile-picture.component.html',
  styleUrls: ['./add-profile-picture.component.scss']
})

export class AddProfilePictureComponent implements OnInit {
  
  @Output() uploadImageConfirmation: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal, private http: HttpClient) {}
  uploadedFile: File | undefined;

  ngOnInit(): void {
  }

  uploadFile() {
    let formData = new FormData();
    if (this.uploadedFile) {
      formData.append("uploads", this.uploadedFile, this.uploadedFile.name);
      this.http.post(API_URL + 'upload', formData)
      .subscribe(() => {
        this.uploadImageConfirmation.emit(true);
        this.modal.close();
      })
    }
  }
  
  fileChange(element: any) {
    this.uploadedFile = element.target.files[0];
  }

  continueToDashboard() {
    this.uploadImageConfirmation.emit(true);
    this.modal.close();
  }
}
