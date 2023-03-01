import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Select2Module } from 'ng-select2-component';
import { DataTablesModule } from "angular-datatables";
//import { SignaturePadModule  } from 'angular2-signaturepad';


/* Material */
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
//import { MatMomentDateModule } from "@angular/ material-moment-adapter";

import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MainComponent } from './components/main/main.component';
import { ProductsComponent } from './components/products/products.component';
import { ProvidersComponent } from './components/providers/providers.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { NewCategoryComponent } from './components/new-category/new-category.component';
import { NewProviderComponent } from './components/new-provider/new-provider.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { RequisitionsComponent } from './components/requisitions/requisitions.component';
import { CiclesComponent } from './components/cicles/cicles.component';
import { NewCicleComponent } from './components/new-cicle/new-cicle.component';
import { EditCicleComponent } from './components/edit-cicle/edit-cicle.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { EditProviderComponent } from './components/edit-provider/edit-provider.component';
import { CompanyComponent } from './components/company/company.component';
import { RanchesComponent } from './components/ranches/ranches.component';
import { NewRanchComponent } from './components/new-ranch/new-ranch.component';
import { EditRanchComponent } from './components/edit-ranch/edit-ranch.component';
import { NewRequisitionComponent } from './components/new-requisition/new-requisition.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { AuthorizeRequisitionComponent } from './components/authorize-requisition/authorize-requisition.component';
import { QuoteComponent } from './components/quote/quote.component';
import { OrderComponent } from './components/order/order.component';
import { AssignProviderComponent } from './components/assign-provider/assign-provider.component';
import { ViewPdfQuotationsComponent } from './components/view-pdf-quotations/view-pdf-quotations.component';
import { ViewPdfOrdersComponent } from './components/view-pdf-orders/view-pdf-orders.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { RejectedRequisitionsComponent } from './components/rejected-requisitions/rejected-requisitions.component';
import { OrderedRequisitionsComponent } from './components/ordered-requisitions/ordered-requisitions.component';
import { SchedulePaymentComponent } from './components/schedule-payment/schedule-payment.component';
import { MakePaymentComponent } from './components/make-payment/make-payment.component';
import { ViewPaymentComponent } from './components/view-payment/view-payment.component';
import { MailService } from './services/mail.service';
import { PaidOrdersComponent } from './components/paid-orders/paid-orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { ReceptionComponent } from './components/reception/reception.component';
import { DeliveryComponent } from './components/delivery/delivery.component';
import { OutputComponent } from './components/output/output.component';
import { WarehouseReportComponent } from './components/warehouse-report/warehouse-report.component';
import { ReceivedOrdersComponent } from './components/received-orders/received-orders.component';
import { ReceiveOrderComponent } from './components/receive-order/receive-order.component';
import { ApplicationsComponent } from './components/applications/applications.component';
import { RunApplicationsComponent } from './components/run-applications/run-applications.component';
import { ApplicationsReportComponent } from './components/applications-report/applications-report.component';
import { NewApplicationComponent } from './components/new-application/new-application.component';
import { EditApplicationComponent } from './components/edit-application/edit-application.component';
import { NgInitDirective } from './directives/ng-init.directive';
import { DeliverApplicationComponent } from './components/deliver-application/deliver-application.component';
import { RunApplicationComponent } from './components/run-application/run-application.component';
import { DebtsToPayComponent } from './components/debts-to-pay/debts-to-pay.component';
import { RedeliverApplicationComponent } from './components/redeliver-application/redeliver-application.component';
import { PresentationsComponent } from './components/presentations/presentations.component';
import { NewPresentationComponent } from './components/new-presentation/new-presentation.component';
import { EditPresentationComponent } from './components/edit-presentation/edit-presentation.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CropsComponent } from './components/crops/crops.component';
import { NewCropComponent } from './components/new-crop/new-crop.component';
import { EditCropComponent } from './components/edit-crop/edit-crop.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { EditCustomerComponent } from './components/edit-customer/edit-customer.component';
import { NotesComponent } from './components/notes/notes.component';
import { NewNoteComponent } from './components/new-note/new-note.component';
import { ExpedientComponent } from './components/expedient/expedient.component';
import { OutputNoteComponent } from './components/output-note/output-note.component';
import { DeliveredNotesComponent } from './components/delivered-notes/delivered-notes.component';
import { ViewNoteComponent } from './components/view-note/view-note.component';
import { EntriesComponent } from './components/entries/entries.component';
import { WithdrawalsComponent } from './components/withdrawals/withdrawals.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { ReNoteComponent } from './components/re-note/re-note.component';
import { EditNoteComponent } from './components/edit-note/edit-note.component';
import { ReEditNoteComponent } from './components/re-edit-note/re-edit-note.component';
import { ReEditApplicationComponent } from './components/re-edit-application/re-edit-application.component';
import { ChargesComponent } from './components/charges/charges.component';
import { ScheduleChargeComponent } from './components/schedule-charge/schedule-charge.component';
import { MakeChargeComponent } from './components/make-charge/make-charge.component';
import { ViewChargeComponent } from './components/view-charge/view-charge.component';
import { DebtsToCollectComponent } from './components/debts-to-collect/debts-to-collect.component';
import { CollectedOrdersComponent } from './components/collected-orders/collected-orders.component';
import { ChangeApplicationComponent } from './components/change-application/change-application.component';
import { DuplicateNoteComponent } from './components/duplicate-note/duplicate-note.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ProductsComponent,
    ProvidersComponent,
    CategoriesComponent,
    NewCategoryComponent,
    NewProviderComponent,
    NewProductComponent,
    EditProductComponent,
    ConfirmDialogComponent,
    RequisitionsComponent,
    CiclesComponent,
    NewCicleComponent,
    EditCicleComponent,
    EditCategoryComponent,
    EditProviderComponent,
    CompanyComponent,
    RanchesComponent,
    NewRanchComponent,
    EditRanchComponent,
    NewRequisitionComponent,
    AuthorizeRequisitionComponent,
    QuoteComponent,
    OrderComponent,
    AssignProviderComponent,
    ViewPdfQuotationsComponent,
    ViewPdfOrdersComponent,
    PaymentsComponent,
    RejectedRequisitionsComponent,
    OrderedRequisitionsComponent,
    SchedulePaymentComponent,
    MakePaymentComponent,
    ViewPaymentComponent,
    PaidOrdersComponent,
    NewOrderComponent,
    ReceptionComponent,
    DeliveryComponent,
    OutputComponent,
    WarehouseReportComponent,
    ReceivedOrdersComponent,
    ReceiveOrderComponent,
    ApplicationsComponent,
    RunApplicationsComponent,
    ApplicationsReportComponent,
    NewApplicationComponent,
    EditApplicationComponent,
    NgInitDirective,
    DeliverApplicationComponent,
    RunApplicationComponent,
    DebtsToPayComponent,
    RedeliverApplicationComponent,
    PresentationsComponent,
    NewPresentationComponent,
    EditPresentationComponent,
    CustomersComponent,
    CropsComponent,
    NewCropComponent,
    EditCropComponent,
    NewCustomerComponent,
    EditCustomerComponent,
    NotesComponent,
    NewNoteComponent,
    ExpedientComponent,
    OutputNoteComponent,
    DeliveredNotesComponent,
    ViewNoteComponent,
    EntriesComponent,
    WithdrawalsComponent,
    UploadFileComponent,
    ReNoteComponent,
    EditNoteComponent,
    ReEditNoteComponent,
    ReEditApplicationComponent,
    ChargesComponent,
    ScheduleChargeComponent,
    MakeChargeComponent,
    ViewChargeComponent,
    DebtsToCollectComponent,
    CollectedOrdersComponent,
    ChangeApplicationComponent,
    DuplicateNoteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule .forRoot(),
    AngularFireModule .initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    Select2Module,
    DataTablesModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableExporterModule,
    HttpClientModule,
    //SignaturePadModule 
  ],
  providers: [AuthService, CurrencyPipe, MailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
