import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs';

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
  allTags: string[] = [];
  auto: any;

  @Output() tagsAdded: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    this.filteredTags = this.tagsControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    // Send the tags array to the parent component
    this.tagsAdded.emit(this.tags);

    this.tagsControl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput!.nativeElement.value = '';
    this.tagsControl.setValue(null);
    
    // Send the tags array to the parent component
    this.tagsAdded.emit(this.tags);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.allTags = [
      'Frontend', 'Backend', 'Git', 'Code Refactory', 'Bug', 'Frontend+Backend', 'Testing'
    ];

   
  }

}
