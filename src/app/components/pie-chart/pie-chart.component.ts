import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {
  @Input() dataObject: any;


  view: any[] = [600, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  tooltipDisabled: boolean = false;
  legendPosition: string = 'below';

  dataArray: [] = [];
  colorScheme = {
    domain: []
  };

  ngOnInit(): void {
    this.dataArray = this.dataObject.tagsArray;
    this.colorScheme.domain = this.dataObject.colorScheme;
  }

  onSelect(data: any): void {
  }

  onActivate(data: any): void {
  }

  onDeactivate(data: any): void {
  }
}
