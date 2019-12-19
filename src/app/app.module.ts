import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { Angular4PaystackModule } from 'angular4-paystack';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { MaterialModule } from "./materials";
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { LiveProjectComponent } from './live-project/live-project.component';
import { SurveyComponent } from './survey/survey.component';
import { PaymentComponent } from './payment/payment.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { ViewApointmentsComponent } from './view-apointments/view-apointments.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { UserModalComponent } from './user-modal/user-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AppointmentComponent,
    LiveProjectComponent,
    SurveyComponent,
    PaymentComponent,
    AdminLoginComponent,
    DashboardComponent,
    CustomersComponent,
    ViewApointmentsComponent,
    ViewSurveyComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    Angular4PaystackModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
    MaterialModule,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
