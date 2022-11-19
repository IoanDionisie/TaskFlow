import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-display-tags',
  templateUrl: './display-tags.component.html',
  styleUrls: ['./display-tags.component.scss']
})
export class DisplayTagsComponent implements OnInit {
  @Input() tags: any;  
  constructor() { }

  ngOnInit(): void { 
  }

}
