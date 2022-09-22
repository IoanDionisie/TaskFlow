import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {

  tags: any;

  constructor(private modal: NgbActiveModal, private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.taskService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  removeTag(tag: any) {
    this.taskService.removeTag(tag._id).subscribe(response  => {
      this.ngOnInit();
    })
  }
  
  closeModal() {
    this.modal.close();
  }
}
