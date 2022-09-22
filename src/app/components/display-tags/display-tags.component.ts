import { Component, Input, OnInit } from '@angular/core';
import { tagsWithColors } from 'src/app/constants/tags-colors';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-display-tags',
  templateUrl: './display-tags.component.html',
  styleUrls: ['./display-tags.component.scss']
})
export class DisplayTagsComponent implements OnInit {
  @Input() tags: any;

  tagsToDisplay: any;
  
  constructor(private taskService: TaskService) { }

  ngOnInit(): void { 
    this.taskService.getTags().subscribe(tags => {
      // TODO get all tags and change the current behavior of hardcoded tags
    });
  }

  ngOnChanges() {
    this.displayTags();
  }

  ngAfterViewInit(): void {
    this.displayTags();
  }

  displayTags() {
    this.tagsToDisplay = [];
    for (let i = 0; i < this.tags.length; ++i) {
      let tagTitle = this.tags[i].title;

      this.tagsToDisplay.push({
        title: tagTitle,
        class: tagsWithColors.get(this.tags[i].title)
      })
    }
  }
}
