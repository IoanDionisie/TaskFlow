import { NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FacadeService } from "src/app/services/facade.service";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { USER_ROLES } from "src/app/constants/user-roles";

@Component({
    selector: "app-users",
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    standalone: true, 
    imports: [NgFor, CommonModule, MatTableModule]
})

export class UsersComponent implements OnInit {

    readonly USER_ROLES = USER_ROLES;
    users: any;
    displayedColumns:string[] =  ['username', 'role', 'actions'];
    userId: any;

    constructor(private facadeService: FacadeService, private modal: NgbActiveModal) {
        
    }

    ngOnInit(): void {
        this.facadeService.getUsers().subscribe((users: any) => {
            console.log(typeof users);
            this.users = users;
        })
        this.userId = this.facadeService.getUser().id;
    }

    closeModal() {
        this.modal.close();
    }

    removeAdmin(user: any) {
        this.facadeService.removeAdmin(user._id).subscribe(response => {
            console.log("removed");
        })
    }

    makeAdmin(user: any) {
        this.facadeService.makeAdmin(user._id).subscribe(response => {
            console.log("removed");
        })
    }

    deleteUser(user: any) {
        this.facadeService.deleteUser(user._id).subscribe(response => {
            console.log("removed");
        })
    }
}