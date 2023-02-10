import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';

@Component({
    selector: 'app-status-circles',
    templateUrl: './status-circles.component.html',
    styleUrls: ['./status-circles.component.scss'],
    standalone: true,
    imports: [NgIf, NgForOf]
})
export class StatusCirclesComponent implements OnInit {

  @Input() circles: number = 0;

  numbers: any;
  decimal: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.numbers = [];

    if (!this.isInt(this.circles) && this.circles > 0) {
      var intgr = Math.floor(this.circles);
      this.decimal = this.circles - Math.floor(this.circles);
      this.circles = intgr;
    }
    this.numbers = [...Array(this.circles)];
  }
  
  isInt(n: number) {
    return n % 1 === 0;
 }

}
