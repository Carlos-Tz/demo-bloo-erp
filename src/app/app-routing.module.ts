import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsReportComponent } from './components/applications-report/applications-report.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ChargesComponent } from './components/charges/charges.component';
import { CiclesComponent } from './components/cicles/cicles.component';
import { CompanyComponent } from './components/company/company.component';
import { CropsComponent } from './components/crops/crops.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DeliverApplicationComponent } from './components/deliver-application/deliver-application.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { EditApplicationComponent } from './components/edit-application/edit-application.component';
import { EditCropComponent } from './components/edit-crop/edit-crop.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';
import { EntriesComponent } from './components/entries/entries.component';
import { ExpedientComponent } from './components/expedient/expedient.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { NewCropComponent } from './components/new-crop/new-crop.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { NewNoteComponent } from './components/new-note/new-note.component';
import { NewRequisitionComponent } from './components/new-requisition/new-requisition.component';
import { NotesComponent } from './components/notes/notes.component';
import { OutputComponent } from './components/output/output.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { PresentationsComponent } from './components/presentations/presentations.component';
import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { RanchesComponent } from './components/ranches/ranches.component';
import { ReceptionComponent } from './components/reception/reception.component';
import { RedeliverApplicationComponent } from './components/redeliver-application/redeliver-application.component';
import { RequisitionsComponent } from './components/requisitions/requisitions.component';
import { RunApplicationComponent } from './components/run-application/run-application.component';
import { RunApplicationsComponent } from './components/run-applications/run-applications.component';
import { WarehouseReportComponent } from './components/warehouse-report/warehouse-report.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { AuthGuard } from './services/auth.guard';
import { SecureInnerPagesGuard } from './services/secure-inner-pages.guard';


const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: MainComponent},
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'providers', component: ProvidersComponent , canActivate: [AuthGuard]},
  {path: 'classifications', component: CategoriesComponent , canActivate: [AuthGuard]},
  {path: 'presentations', component: PresentationsComponent , canActivate: [AuthGuard]},
  {path: 'crops', component: CropsComponent , canActivate: [AuthGuard]},
  {path: 'customers', component: CustomersComponent , canActivate: [AuthGuard]},
  {path: 'requisitions', component: RequisitionsComponent , canActivate: [AuthGuard]},
  {path: 'cicles', component: CiclesComponent , canActivate: [AuthGuard]},
  {path: 'ranches', component: RanchesComponent , canActivate: [AuthGuard]},
  {path: 'company', component: CompanyComponent , canActivate: [AuthGuard]},
  {path: 'new-requisition', component: NewRequisitionComponent , canActivate: [AuthGuard]},
  {path: 'payments', component: PaymentsComponent , canActivate: [AuthGuard]},
  {path: 'reception', component: ReceptionComponent , canActivate: [AuthGuard]},
  {path: 'delivery', component: DeliveryComponent , canActivate: [AuthGuard]},
  {path: 'output', component: OutputComponent , canActivate: [AuthGuard]},
  {path: 'warehouse-report', component: WarehouseReportComponent , canActivate: [AuthGuard]},
  {path: 'applications', component: ApplicationsComponent , canActivate: [AuthGuard]},
  {path: 'run-applications', component: RunApplicationsComponent , canActivate: [AuthGuard]},
  {path: 'applications-report', component: ApplicationsReportComponent , canActivate: [AuthGuard]},
  {path: 'new-application', component: NewApplicationComponent , canActivate: [AuthGuard]},
  {path: 'edit-application/:id', component: EditApplicationComponent , canActivate: [AuthGuard]},
  {path: 'deliver-application/:id', component: DeliverApplicationComponent , canActivate: [AuthGuard]},
  {path: 'redeliver-application/:id', component: RedeliverApplicationComponent , canActivate: [AuthGuard]},
  {path: 'run-application/:id', component: RunApplicationComponent , canActivate: [AuthGuard]},
  {path: 'new-crop', component: NewCropComponent, canActivate: [AuthGuard]},
  {path: 'edit-crop/:id', component: EditCropComponent , canActivate: [AuthGuard]},
  {path: 'new-customer', component: NewCustomerComponent, canActivate: [AuthGuard]},
  {path: 'edit-customer/:id', component: EditCustomerComponent , canActivate: [AuthGuard]},
  {path: 'notes', component: NotesComponent , canActivate: [AuthGuard]},
  {path: 'new-note', component: NewNoteComponent , canActivate: [AuthGuard]},
  {path: 'expedient/:id', component: ExpedientComponent , canActivate: [AuthGuard]},
  {path: 'entries', component: EntriesComponent , canActivate: [AuthGuard]},
  {path: 'withdrawals', component: WithdrawalsComponent , canActivate: [AuthGuard]},
  {path: 'edit-note/:id', component: EditNoteComponent , canActivate: [AuthGuard]},
  {path: 'charges', component: ChargesComponent , canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [SecureInnerPagesGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
