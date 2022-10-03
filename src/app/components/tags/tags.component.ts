import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER, M} from '@angular/cdk/keycodes';
import { debounceTime, Observable } from 'rxjs';
import { startWith, map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorMessageComponent } from '../dialogs/error-message/error-message.component';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>|undefined;

  @ViewChildren('autocomplete') autocompleteDiv: ElementRef|undefined;
  
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new FormControl('');
 
  filteredTags: Observable<string[]>|undefined;
  tags: string[] = [];
  tagsToEmit: any;
  allTags: string[] = [];
  auto: any;

  tagsFromServer: any;

  tooManyTags: boolean = false;

  tagsWithColors: any;

  @Input() currentTags: any;

  @Output() tagsAdded: EventEmitter<string[]> = new EventEmitter();

  constructor(private modalService: NgbModal, private taskService: TaskService) {
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    if (this.tags.length == 3) {
      this.tooManyTagsError();
    } else {
      const value = (event.value || '').trim();
      if (value) {
        this.tags.push(value);
      }
  
      // Send the tags array to the parent component
      this.tagsAdded.emit(this.tags);
      this.tagsControl.setValue(null);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {   
    if (this.tags.length == 3) {
      this.tooManyTagsError();
    } else {
      for (let i = 0; i < this.tagsFromServer.length; ++i) {
        if (this.tagsFromServer[i].title == event.option.viewValue) {
          this.tags.push(this.tagsFromServer[i]);
          break;
        }
      }
  
      this.tagInput!.nativeElement.value = '';
      this.tagsControl.setValue(null);
      // Send the tags array to the parent component
      this.tagsAdded.emit(this.tags);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.tagsFromServer.filter((tag: { title: string; }) => tag.title.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.taskService.getTags().subscribe(tags => {
      this.tagsFromServer = tags;
      this.allTags = this.tagsFromServer.map(function(item: { [x: string]: any; }) {
        return item['title'];
      });
    });
    
    if (this.currentTags.length > 0) {
      this.tags = this.currentTags;
    }
  }

  tooManyTagsError() {
    this.tooManyTags = true;
    setTimeout(() =>{ 
      this.tooManyTags = false;
    }, 3000);
  }

}
