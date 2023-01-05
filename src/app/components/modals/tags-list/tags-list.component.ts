import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from 'src/app/enums/actions';
import { Tag } from 'src/app/models/tag.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {

  tags: any;

  @Output() showMessage: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal, private taskService: TaskService) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.taskService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  removeTag(tag: Tag) {
    this.taskService.removeTag(tag._id).subscribe(response  => {
      let showMessageData = {
        tagName: tag.title,  
        message: Actions.removeTag
      }
      this.showMessage.emit(showMessageData);
      this.closeModal();
    })
  }
  
  closeModal() {
    this.modal.close();
  }
}
