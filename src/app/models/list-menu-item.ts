export interface ListMenuItem {
    name: string;
    percentCompleted: number;
    _id: string;
    children?: ListMenuItem[];
}