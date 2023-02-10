import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { PieChartComponent } from '../../pie-chart/pie-chart.component';
import { NgIf } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
    selector: 'app-view-list',
    templateUrl: './view-list.component.html',
    styleUrls: ['./view-list.component.scss'],
    standalone: true,
    imports: [NgIf, PieChartComponent]
})
export class ViewListComponent implements OnInit {
  readonly ITEM_STATUS = ITEM_STATUS;

  @Input() list: any;
  @Input() tagsObject: any;

  dateCreated:  any;
  dateCompleted: any;
  description: string
  observations: string;

  constructor(private modal: NgbActiveModal, private facadeService: FacadeService) {
    this.description = '';
    this.observations = '';
   }

  ngOnInit(): void {
    this.dateCreated = this.facadeService.convertDate(new Date(this.list.dateCreated));
    this.dateCompleted = this.facadeService.convertDate(new Date(this.list.dateCompleted));

    if (this.list.description) {
      this.description = this.facadeService.linkifyText(this.list.description);
    }

    if (this.list.observations) {
      this.observations =  this.facadeService.linkifyText(this.list.observations);
    }
  }

  closeModal() {
    this.modal.close();
  }
}
