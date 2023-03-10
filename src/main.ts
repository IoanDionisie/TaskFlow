import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { ToastrModule } from 'ngx-toastr';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { AutosizeModule } from '@techiediaries/ngx-textarea-autosize';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { errorInterceptorProviders } from './app/helpers/error.interceptor';
import { authInterceptorProviders } from './app/helpers/auth.interceptor';
import { RouterModule } from '@angular/router';
import { FacadeService } from './app/services/facade.service';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, RouterModule.forRoot(routes), NgbModule, HttpClientModule, MatDialogModule, FormsModule, MatTabsModule, DragDropModule, AutosizeModule, MatTreeModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatChipsModule, MatAutocompleteModule, ReactiveFormsModule, CommonModule, NgxChartsModule, BrowserAnimationsModule, 
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-top-center',
            progressBar: true,
            progressAnimation: 'decreasing',
            disableTimeOut: "extendedTimeOut"
        })),
        authInterceptorProviders, 
        errorInterceptorProviders,
        provideAnimations(),
        FacadeService
    ]
}).catch(err => console.error(err));
