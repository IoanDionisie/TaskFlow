import { ITEM_STATUS } from 'src/app/constants/item-status';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { TagsComponent } from '../../tags/tags.component';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryItem } from 'src/app/models/history-item';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf, AutosizeModule, NgForOf, TagsComponent, MatListModule, CommonModule]
})

export class HistoryComponent implements OnInit  {

  elements: HistoryItem[] = [];


  readonly ITEM_STATUS = ITEM_STATUS;

  constructor(private modal: NgbActiveModal, private facadeService: FacadeService) {
  }

  ngOnInit(): void {
    this.facadeService.getHistory().subscribe((elements: any) => {
      console.log(elements);
      this.elements = elements;
  })
  }

  confirm() {

  }

  closeModal() {
    this.modal.close();
  }
}
