import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { PieChartModule } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    standalone: true,
    imports: [PieChartModule, JsonPipe]
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
