import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FacadeService } from 'src/app/services/facade.service';
import * as global from 'src/app/constants/variables';


@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, NgIf, MatButtonModule, MatIconModule]
})

export class CustomPaginatorComponent implements OnInit {

  @Input() showPagination: boolean = true;

  list: any[] = [];
  @Output() eventChange: EventEmitter<any> = new EventEmitter();

  selectedPage: number = 0;
  pageCount: number = 0;
  pageSize: number = global.defaultPageSize;
  pageSizeOptions: number[] = [6, 8, 10, 15, 20];

  showPaginator: boolean = false;

  output = {
    pageSize: this.pageSize,
    selectedPage: this.selectedPage,
    pageSizeChanged: false
  }

  ngOnInit(): void {
    if (this.facadeService.getPageSize() != null) {
      this.pageSize = Number(this.facadeService.getPageSize());
    }
  }

  constructor(private facadeService: FacadeService) {

  }

  changePageSize(event: any) {
    this.pageSize = event.value;
    this.selectedPage = 0;

    this.output.pageSize = this.pageSize;
    this.output.selectedPage = 0;
    this.output.pageSizeChanged = true;
    this.pageCount = Math.ceil(this.list.length / this.pageSize);
    this.facadeService.storePageSize(this.pageSize);
    this.eventChange.emit(this.output);
  }

  previousPage() {
    this.selectedPage--;
    this.output.pageSizeChanged = false;
    this.output.pageSize = this.pageSize;
    this.output.selectedPage = this.selectedPage;
    this.eventChange.emit(this.output);
  }

  nextPage() {
    this.selectedPage++;
    this.output.pageSizeChanged = false;
    this.output.pageSize = this.pageSize;
    this.output.selectedPage = this.selectedPage;
    this.eventChange.emit(this.output);
  }

  loadList(list: any) {
    this.showPaginator = false;
    this.list = list;
    if (list.length > 0) {
      this.showPaginator = true;
    }
    this.selectedPage = 0;
    this.pageCount = Math.ceil(this.list.length / this.pageSize);
  }

  modifyPageCount(list: any) {
    this.pageCount = Math.ceil(this.list.length / this.pageSize);
  }

  modifySelectedPage(selectedPage: number) {
    this.selectedPage = selectedPage;
  }
}
