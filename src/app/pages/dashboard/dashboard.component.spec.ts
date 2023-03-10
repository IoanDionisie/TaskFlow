import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { async, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomPaginatorComponent } from 'src/app/components/custom-paginator/custom-paginator.component';
import { ErrorMessageComponent } from 'src/app/components/dialogs/error-message/error-message.component';
import { SuccessMessageComponent } from 'src/app/components/dialogs/success-message/success-message.component';
import { DisplayTagsComponent } from 'src/app/components/display-tags/display-tags.component';
import { ListsComponent } from 'src/app/components/lists/lists.component';
import { StatusCirclesComponent } from 'src/app/components/status-circles/status-circles.component';
import { WorkBreakComponent } from 'src/app/components/work-break/work-break.component';
import { SearchTaskFilterPipe } from 'src/app/pipes/search-task-filter.pipe';
import { FacadeService } from 'src/app/services/facade.service';
import { ImageService } from 'src/app/services/image.service';
import { DashboardComponent } from './dashboard.component';
import { TestingComponent } from './testing/testing.component';

describe('DashboardComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [TestingComponent, WorkBreakComponent,
            CustomPaginatorComponent, NgbDropdown, NgbDropdownToggle,
             NgbDropdownMenu, SuccessMessageComponent, ErrorMessageComponent,
              ListsComponent, NgIf, FormsModule, MatTabsModule, DragDropModule,
               NgForOf, DisplayTagsComponent, NgClass, StatusCirclesComponent,
                NgbTooltip, SearchTaskFilterPipe, NgxSpinnerModule, DashboardComponent],
      providers: [
        FacadeService, ToastrService, ImageService
      ]
    }).compileComponents();
  }));
  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});