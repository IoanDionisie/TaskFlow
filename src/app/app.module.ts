import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { DeleteItemComponent } from './components/dialogs/delete-item/delete-item.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateTaskComponent } from './components/modals/create-task/create-task.component';
import { CreateListComponent } from './components/modals/create-list/create-list.component'; 
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ModifyItemComponent } from './components/modals/modify-item/modify-item.component';
import {AutosizeDirective, AutosizeModule} from '@techiediaries/ngx-textarea-autosize';
import {MatTree, MatTreeModule} from '@angular/material/tree';
import { ListsComponent } from './components/lists/lists.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DeleteItemComponent,
    CreateTaskComponent,
    CreateListComponent,
    ModifyItemComponent,
    ListsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTabsModule,
    DragDropModule,
    AutosizeModule,
    MatTreeModule,

    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 22,
      outerStrokeWidth: 5,
      outerStrokeColor: "#78C000",
      showInnerStroke: false,
      animationDuration: 300,
      showSubtitle: false,
      titleFontSize: "14",
      unitsFontSize: "14",
      animation: true,
      titleColor:"#12261D",
      unitsColor:"#12261D"
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
