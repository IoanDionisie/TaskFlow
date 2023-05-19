import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, isEmpty } from 'rxjs';
import { startWith, map } from 'rxjs';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgForOf, AsyncPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
    standalone: true,
    imports: [MatFormFieldModule, NgClass, MatChipsModule, NgForOf, MatIconModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatOptionModule, AsyncPipe]
})
export class TagsComponent {

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>|undefined;

  @ViewChildren('autocomplete') autocompleteDiv: ElementRef|undefined;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsControl = new UntypedFormControl('');
  filteredTags: Observable<string[]>|undefined;
  tags: string[] = [];
  tagsToEmit: any;
  allTags: string[] = [];
  auto: any;
  tagsFromServer: any;
  tooManyTags: boolean = false;
  tagsWithColors: any;

  readonly ITEM_STATUS = ITEM_STATUS;

  @Input() taskCompleted: string = '';

  @Input() currentTags: any;

  @Output() tagsAdded: EventEmitter<string[]> = new EventEmitter();

  constructor(private facadeService: FacadeService) {
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
    }

    // Clear the input value
    this.tagsControl.setValue(null);
    this.tagInput!.nativeElement.value = '';
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

  private _filter(value: string): any {
    if(typeof value == 'string')  {
      const filterValue = value.toLowerCase();
      return this.tagsFromServer.filter((tag: { title: string; }) => tag.title.toLowerCase().includes(filterValue));
    }
  }

  ngOnInit(): void {
    this.tagsControl.disable();
  }

  ngAfterViewInit() {
    this.facadeService.getTags().subscribe(tags => {
      this.tagsFromServer = tags;
      this.allTags = this.tagsFromServer.map(function(item: { [x: string]: any; }) {
        return item['title'];
      });
    });

    if (this.currentTags && this.currentTags.length > 0) {
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
