import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.scss']
})
export class ViewTaskComponent implements OnInit {

  @Input() task: any;

  constructor(private modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.close();
  }

}
