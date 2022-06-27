import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  lists: any;
  tasks: any;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
  }

  createNewList() {
    this.taskService.createList("Testing").subscribe((response: any) => {
      console.log(response);
    });
  }

  addTaskToList() {

  }

}
