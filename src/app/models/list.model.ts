export class List {

    title?: string;
    description?: string;
    status?: string;
    dateCreated?: Date;
    dateStarted?: Date;
    dateCompleted?: Date;
    observations?: string;
    _id?: any;
    userId?: string;
    percentCompleted?: number;

    constructor(title: string) {
        this.title = title;
    }
    
}