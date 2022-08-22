import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { AuthGuard } from './services/auth.guard';
import { SecureInnerPagesGuard } from './services/secure-inner-pages.guard';


const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: MainComponent},
  {path: 'products', component: ProductsComponent, canActivate: [AuthGuard]},
  {path: 'providers', component: ProvidersComponent , canActivate: [AuthGuard]},
  {path: 'categories', component: CategoriesComponent , canActivate: [AuthGuard]},
  /*{path: 'notas', component: NotasComponent, canActivate: [AuthGuard]},
  {path: 'ordenes', component: OrdenesComponent, canActivate: [AuthGuard]},
  {path: 'inspeccion', component: InspeccionComponent, canActivate: [AuthGuard]},
  {path: 'carwash', component: CarwashComponent, canActivate: [AuthGuard]},
  {path: 'list-carwash', component: ListTicketsComponent, canActivate: [AuthGuard]},
  {path: 'carwashe', component: CarwasheComponent, canActivate: [AuthGuard]},
  {path: 'carwash1', component: Carwash1Component, canActivate: [AuthGuard]},
  {path: 'carwash2', component: Carwash2Component, canActivate: [AuthGuard]},
  {path: 'carwash3', component: Carwash3Component, canActivate: [AuthGuard]},
  {path: 'nuevo-cliente', component: NewRegisterComponent, canActivate: [AuthGuard]},
  {path: 'nueva-orden', component: NewOrdenComponent, canActivate: [AuthGuard]},
  {path: 'nueva-nota', component: NewNotaComponent, canActivate: [AuthGuard]},
  {path: 'nueva-inspeccion', component: NewInspeccionComponent, canActivate: [AuthGuard]},
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
