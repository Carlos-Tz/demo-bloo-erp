import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { CiclesComponent } from './components/cicles/cicles.component';
import { CompanyComponent } from './components/company/company.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NewRequisitionComponent } from './components/new-requisition/new-requisition.component';
import { OutputComponent } from './components/output/output.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { RanchesComponent } from './components/ranches/ranches.component';
import { ReceptionComponent } from './components/reception/reception.component';
import { RequisitionsComponent } from './components/requisitions/requisitions.component';
import { WarehouseReportComponent } from './components/warehouse-report/warehouse-report.component';
import { AuthGuard } from './services/auth.guard';
import { SecureInnerPagesGuard } from './services/secure-inner-pages.guard';


const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: MainComponent},
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'providers', component: ProvidersComponent , canActivate: [AuthGuard]},
  {path: 'classifications', component: CategoriesComponent , canActivate: [AuthGuard]},
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
  /*
  {path: 'editar-cliente/:key', component: EditRegisterComponent, canActivate: [AuthGuard]},
  {path: 'editar-orden/:key', component: EditOrdenComponent, canActivate: [AuthGuard]},
  {path: 'editar-nota/:key', component: EditNotaComponent, canActivate: [AuthGuard]},
  {path: 'editar-inspeccion/:key', component: EditInspeccionComponent, canActivate: [AuthGuard]},*/
  {path: 'login', component: LoginComponent, canActivate: [SecureInnerPagesGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
