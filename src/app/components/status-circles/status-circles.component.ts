import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-circles',
  templateUrl: './status-circles.component.html',
  styleUrls: ['./status-circles.component.scss']
})
export class StatusCirclesComponent implements OnInit {

  @Input() circles: number = 0;

  numbers: any;
  decimal: number = 0;

  constructor() { }

  ngOnInit(): void {

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
