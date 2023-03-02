import { T } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_STATUS } from 'src/app/constants/item-status';
import { DisplayTagsComponent } from '../../display-tags/display-tags.component';
import { NgIf } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';


@Component({
    selector: 'app-welcome-page',
    templateUrl: './welcome-page.component.html',
    styleUrls: ['./welcome-page.component.scss'],
    standalone: true,
    imports: [NgIf]
})
export class WelcomePageComponent implements OnInit {

    @Output() tutorial = new EventEmitter();
    
    ngOnInit(): void {
        this.facadeService.storeShowTutorial("true");
    }

    constructor(private modal: NgbActiveModal, private facadeService: FacadeService) { 
        
    }

    
    startTutorial() {
      this.tutorial.emit(true);  
      this.modal.close();
    }

    closeModal() {
        this.facadeService.storeShowTutorial("false");
        this.modal.close();
    }
    

}