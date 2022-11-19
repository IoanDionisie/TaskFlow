export class Task {

    title: string;
    description?: string;
    status?: string;
    isStarted?: boolean;
    dateCreated?: Date;
    dateStarted?: Date;

    constructor(title: string) {
        this.title = title;
    }
}