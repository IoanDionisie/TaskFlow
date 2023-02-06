import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private webReqService: WebRequestService) { }

  createTag(payload: any) {
    return this.webReqService.post('tags', payload);
  }

  getTags() {
    return this.webReqService.get('tags');
  }

  modifyTagColor(tagId: string, color: string) { 
    var tag = {
      id: tagId,
      color: color
    }
    let link = 'updatetag/' + tagId;
    return this.webReqService.patch(link, tag);
  }

  removeTag(tagId: any) {
    let link = 'tags/' + tagId;
    return this.webReqService.delete(link);
  }

  removeTags() {
    let link = 'removetags/';
    return this.webReqService.delete(link);
  }
}
