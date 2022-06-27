import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Model } from 'mongoose';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lists: any[] = [];
  tasks: any;
  
  selectedList: any;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.getAllLists();
  }

  createNewList() {
    this.taskService.createList("Testing").subscribe((response: any) => {
      this.lists.push(response);
    }); 
  }

  getAllLists() {
    this.taskService.getLists().subscribe((response: any) => {
      this.lists = response;
      this.selectedList = this.lists[0];
      this.getAllTasks(this.selectedList._id);
    });
  }

  getAllTasks(listId: any) {
    this.taskService.getTasks(listId).subscribe((response: any) => {
      this.tasks = response;
    });
  }

  createNewTask() {
    let task = {title: ''};
    task.title = "Testiiing";

    this.taskService.createTask(this.selectedList._id, task).subscribe((response: any) => {
      this.tasks.push(response);
    })
  }

}
