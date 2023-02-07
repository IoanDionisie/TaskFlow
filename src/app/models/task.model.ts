import {ANIMATIONS} from "../constants/animations";

export class Task {

    title: string;
    description?: string;
    status?: string;
    isStarted?: string;
    dateCreated?: Date;
    dateStarted?: Date;
    lastDateStarted?: Date;
    animation: string;

    constructor(title: string) {
        this.title = title;
        this.animation = ANIMATIONS.none;
    }
}