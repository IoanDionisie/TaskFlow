import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

const IMAGE_API = 'http://localhost:3000/api/images/';
const PROFILE_PICTURE = 'profilepicture';

@Injectable({
  providedIn: 'root'
})

export class ImageService {

  constructor(private http: HttpClient, private token: TokenStorageService) { }

  getProfilePicture(): string {
    let profilePicture = IMAGE_API + this.token.getUser().id + "-profilepicture.jpg";
    return profilePicture;
  }

  setProfilePicture() {
    let profilePicture = IMAGE_API + this.token.getUser().id + "-profilepicture.jpg";
    window.sessionStorage.setItem(PROFILE_PICTURE, profilePicture);
  }
}
