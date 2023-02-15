import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  constructor(private webReqService: WebRequestService) { }

  getDataForExport() {
    return this.webReqService.get('export')
  }

  importData(data: any) {
    return this.webReqService.post('import', data);
  }

  checkFile(file: any) {
    let link = 'checkfile/' + file;
    return this.webReqService.get(link);
  }

  getChangelog() {
    let link = 'CHANGELOG.md';
    return this.webReqService.getLocally(link);
  }
}
