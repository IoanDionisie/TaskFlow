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
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { MatTreeModule } from '@angular/material/tree';
import { ListsComponent } from './components/lists/lists.component';
import { SuccessMessageComponent } from './components/dialogs/success-message/success-message.component';
import { ViewTaskComponent } from './components/modals/view-task/view-task.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterComponent } from './pages/register/register.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { WorkBreakComponent } from './components/work-break/work-break.component';
import { SearchTaskFilterPipe } from './pipes/search-task-filter.pipe';
import { TagsComponent } from './components/tags/tags.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from "@angular/forms";
import { DisplayTagsComponent } from './components/display-tags/display-tags.component';
import { ErrorMessageComponent } from './components/dialogs/error-message/error-message.component';
import { ViewListComponent } from './components/modals/view-list/view-list.component';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';
import { MyAccountComponent } from './components/modals/my-account/my-account.component';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/modals/settings/settings.component';
import { TagsListComponent } from './components/modals/tags-list/tags-list.component';
import { ChangeThemeComponent } from './components/change-theme/change-theme.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { StatusCirclesComponent } from './components/status-circles/status-circles.component';
import { AddProfilePictureComponent } from './components/modals/add-profile-picture/add-profile-picture.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';

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
    RegisterComponent,
    WorkBreakComponent,
    SearchTaskFilterPipe,
    TagsComponent,
    DisplayTagsComponent,
    ErrorMessageComponent,
    ViewListComponent,
    PasswordStrengthComponent,
    MyAccountComponent,
    SettingsComponent,
    TagsListComponent,
    ChangeThemeComponent,
    PieChartComponent,
    StatusCirclesComponent,
    AddProfilePictureComponent,
    ResetPasswordComponent,
    NewPasswordComponent
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
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule, 
    CommonModule,
    NgxChartsModule
  ],

  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
