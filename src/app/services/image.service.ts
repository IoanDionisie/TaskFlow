import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FacadeService } from './facade.service';

const IMAGE_API = 'http://localhost:3000/api/images/';
const PROFILE_PICTURE = 'profilepicture';
const EMPTY_PROFILE_PICTURE = "//ssl.gstatic.com/accounts/ui/avatar_2x.png";

export interface HttpRequestState<T> {
  isLoading: boolean;
  value?: T;
  error?: HttpErrorResponse | Error;
}

@Injectable({
  providedIn: 'root'
})

export class ImageService {
  private _profilePictureSource = new BehaviorSubject<string>("");
  profilePicture$ = this._profilePictureSource.asObservable();

  constructor(private facadeService: FacadeService) { }

  setProfilePicture() {
    let profilePicture = IMAGE_API + this.facadeService.getUser().id + "-profilepicture.jpg";
    let localFile = this.facadeService.getUser().id + "-profilepicture.jpg";

    this.facadeService.checkFile(localFile).subscribe(response => {
      if (response == true) {
        window.sessionStorage.setItem(PROFILE_PICTURE, profilePicture);
        this._profilePictureSource.next(profilePicture);
      } else {
        this._profilePictureSource.next(EMPTY_PROFILE_PICTURE);
      }
    });
  }
}
