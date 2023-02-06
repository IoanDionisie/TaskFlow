import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from 'src/app/enums/actions';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {

  tags: any;

  @Output() showMessage: EventEmitter<any> = new EventEmitter();

  constructor(private modal: NgbActiveModal,
    private tagService: TagService) { }

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
      console.log(tags);
    });
  }

  removeTag(tag: Tag, index: number) {
    this.tagService.removeTag(tag._id).subscribe(response  => {
      let showMessageData = {
        tagName: tag.title,  
        message: Actions.removeTag
      }
      this.showMessage.emit(showMessageData);
      this.tags.splice(index, 1);
    })
  }
  
  closeModal() {
    this.modal.close();
  }

  changeTagColor(tag: Tag, index: number, event: any) {
    var color = event.target.value;
    if (tag._id) {
      this.tagService.modifyTagColor(tag._id, color).subscribe(response => {
        this.tags[index].color = color;
        let showMessageData = {
          message: Actions.changeTagColor,
          tagName: tag.title
        }
        this.showMessage.emit(showMessageData);
      });
    }
  }  
}
