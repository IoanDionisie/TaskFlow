export class Tag {

    _id?: string;
    title: string;
    color?: string;

    constructor(title: string) {
        this.title = title;
    }
}