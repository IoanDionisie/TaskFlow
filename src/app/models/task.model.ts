export class Task {

    title: string;
    description?: string;
    status?: string;
    isStarted?: string;
    dateCreated?: Date;
    dateStarted?: Date;
    lastDateStarted?: Date;

    constructor(title: string) {
        this.title = title;
    }
}