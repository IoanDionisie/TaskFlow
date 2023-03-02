import { Component, Input, SimpleChange } from "@angular/core";
import { List } from "src/app/models/list.model";
import { NgFor } from "@angular/common";

@Component({
    selector: 'app-testing',
    templateUrl: './testing.component.html',
    styleUrls: ['./testing.component.scss'],
    standalone: true,
    imports: [NgFor]
})

export class TestingComponent {

    @Input() testInput: List[];

    lists: List[] = [];

    constructor() {
        this.testInput = [];
     }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChange): void {
        this.lists = changes["testInput" as keyof SimpleChange].currentValue;
    }

}