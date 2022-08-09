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
import {AutosizeModule} from '@techiediaries/ngx-textarea-autosize';
import {MatTreeModule} from '@angular/material/tree';
import { ListsComponent } from './components/lists/lists.component';
import { SuccessMessageComponent } from './components/dialogs/success-message/success-message.component';
import { ViewTaskComponent } from './components/modals/view-task/view-task.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { RegisterComponent } from './pages/register/register.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
 
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DeleteItemComponent,
    CreateTaskComponent,
    CreateListComponent,
    ModifyItemComponent,
    ListsComponent,
    SuccessMessageComponent,
    ViewTaskComponent,
    RegisterComponent
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
    MatButtonModule,
    MatIconModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
