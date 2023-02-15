import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, NgFor, MatButtonModule, MatIconModule]
})
export class CustomPaginatorComponent implements OnInit {

  @Input() list: any[] = [];
  @Output() eventChange: EventEmitter<any> = new EventEmitter();

  selectedPage: number = 0;
  pageCount: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  output = {
    pageSize: this.pageSize,
    selectedPage: this.selectedPage
  }

  ngOnInit(): void {
    this.pageCount = Math.ceil(this.list.length / this.pageSize);
  }

  changePageSize(event: any) {
    this.pageSize = event.value;
    this.output.pageSize = this.pageSize;
    this.eventChange.emit(this.output);
  }

  previousPage() {
    this.selectedPage--;
    this.output.selectedPage = this.selectedPage;
    this.eventChange.emit(this.output);
  }

  nextPage() {
    this.selectedPage++;
    this.output.selectedPage = this.selectedPage;
    this.eventChange.emit(this.output);
  }
}
