import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OthersService } from './others.service';
import { TaskService } from './task.service';
import { TokenStorageService } from './token-storage.service';

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

  constructor(private token: TokenStorageService, private othersService: OthersService) { }

  setProfilePicture() {
    let profilePicture = IMAGE_API + this.token.getUser().id + "-profilepicture.jpg";
    let localFile = this.token.getUser().id + "-profilepicture.jpg";

    this.othersService.checkFile(localFile).subscribe(response => {
      if (response == true) {
        window.sessionStorage.setItem(PROFILE_PICTURE, profilePicture);
        this._profilePictureSource.next(profilePicture);
      } else {
        this._profilePictureSource.next(EMPTY_PROFILE_PICTURE);
      }
    });
  }
}
