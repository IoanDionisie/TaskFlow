import { ITEM_STATUS } from 'src/app/constants/item-status';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TagsComponent } from '../../tags/tags.component';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoryItem } from 'src/app/models/history-item';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { merge, of } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { NgbModal, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss'],
    standalone: true,
    imports: [FormsModule, NgIf, AutosizeModule,
      NgForOf, TagsComponent, MatListModule, CommonModule,
      MatPaginatorModule, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu]
})

export class HistoryComponent implements OnInit  {

  elements: HistoryItem[] = [];
  paginatorElements: HistoryItem[] = [];
  readonly ITEM_STATUS = ITEM_STATUS;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;

  constructor(private modal: NgbActiveModal, private facadeService: FacadeService) {
  }

  ngOnInit(): void {
    this.facadeService.getHistory().subscribe((elements: any) => {
      this.elements = elements;
      this.paginatorElements = elements;
      console.log(elements);
      this.linkListToPaginator();
    })
  }

  linkListToPaginator() {
    merge(this.paginator?.page).pipe(
        startWith({}),
        switchMap(() => {
          return of(this.elements);
  })).subscribe(res => {
      const from = this.paginator!.pageIndex * this.paginator!.pageSize;
      const to = from + this.paginator!.pageSize;
      this.paginatorElements = res.slice(from, to);
      console.log(from, to, res);
    });
  }

  onChangePage(event: Event) {
    console.log(event);
  }

  closeModal() {
    this.modal.close();
  }
}
