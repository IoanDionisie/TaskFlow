import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForOf } from '@angular/common';

@Component({
    selector: 'app-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.scss'],
    standalone: true,
    imports: [NgForOf]
})
export class ChangelogComponent implements OnInit  {

@Input() changelog: string | undefined;
textLines: any[] = [];
  
  constructor(private modal: NgbActiveModal) {}

  ngOnInit() {
    if (typeof this.changelog !== 'undefined') {
      for (const line of this.changelog.split(/[\r\n]+/)){
        if (line.startsWith('##')) {
          this.textLines.push({type: 'title', text: line});
        } else if (line.startsWith('#')) {
          this.textLines.push({type: 'header', text: line});
        } else {
          this.textLines.push({type: 'text', text: line});
        }
      }
    }
  }

  closeModal() {
    this.modal.close();
  }
}
