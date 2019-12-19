import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveProjectComponent } from './live-project/live-project.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SurveyComponent } from './survey/survey.component';
import { PaymentComponent } from './payment/payment.component';
import { ResolveIdService } from './resolvers/resolve-id.service';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteGuardGuard } from './guards/route-guard.guard';
import { CustomersComponent } from './customers/customers.component';
import { ViewApointmentsComponent } from './view-apointments/view-apointments.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { UserModalComponent } from './user-modal/user-modal.component';
import { UsersResolverService } from './resolvers/users-resolver.service';
import { AppointmentResolverService } from './resolvers/appointment-resolver.service';
import { SurveyResolverService } from './resolvers/survey-resolver.service';


const routes: Routes = [
  { path: "live-project", component: LiveProjectComponent },
  { path: "appointment/:id", component: AppointmentComponent, resolve: { resolves: ResolveIdService } },
  { path: '', redirectTo: '/live-project', pathMatch: 'full'},
  { path: 'survey/:id', component: SurveyComponent, resolve: { resolves: ResolveIdService } },
  { path: 'pay/:id', component: PaymentComponent, resolve: { resolves: ResolveIdService } },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin', component: DashboardComponent, canActivateChild: [RouteGuardGuard], children: [
    { path: 'users', component: CustomersComponent, children: [
      { path: 'appointment-history', component: UserModalComponent }
    ], resolve: { resolves: UsersResolverService } },
    { path: 'view-appointments', component: ViewApointmentsComponent, resolve: { resolves: AppointmentResolverService } },
    { path: 'view-surveys', component: ViewSurveyComponent, resolve: { resolves: SurveyResolverService} },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
