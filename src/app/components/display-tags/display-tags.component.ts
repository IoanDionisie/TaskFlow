import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { NgForOf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-display-tags',
    templateUrl: './display-tags.component.html',
    styleUrls: ['./display-tags.component.scss'],
    standalone: true,
    imports: [NgForOf, NgStyle]
})
export class DisplayTagsComponent implements OnInit {
  @Input() tags: any;  
  constructor() { }

  ngOnInit(): void { 
  }

}
