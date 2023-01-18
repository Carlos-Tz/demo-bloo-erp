import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation';
import { ApiProductService } from './api-product.service';
import { ApiProviderService } from './api-provider.service';
import 'fecha';
import fechaObj from 'fecha';
import { ApiRequisitionService } from './api-requisition.service';

@Injectable({
  providedIn: 'root'
})
export class ApiQuoteService {

  public lastQuotationRef!: Observable<any[]>;
  public lastOrderRef!: Observable<any[]>;
  public quotations_ = [];

  constructor(
    private db: AngularFireDatabase,
    private apiP: ApiProductService,
    private apiPr: ApiProviderService,
    private apiR: ApiRequisitionService
    ) { }

  AddQuotation(products: any[]) {
    this.quotations_ = [];
    products.forEach(product => {
      this.apiP.GetProduct(product.key).valueChanges().subscribe(prod => {
        if(prod.providers){
          prod.providers.forEach(element => {
            this.apiPr.GetProvider(element).valueChanges().subscribe(prov => {
              //if(prov.email){
                let quotation: Quotation = { 
                  date: '',
                  id: null,
                  petitioner: '',
                  email: '',
                  provider: '',
                  products: []
                };
                quotation.id = 0;
                quotation.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
                quotation.provider = prov.name;
                quotation.email = prov.email;
                quotation.petitioner = 'Demo';
                quotation.products.push(product);
                this.quotations_.push(quotation);
                
                //await new Promise((resolve, reject) => setTimeout(resolve, 3000));
                /* const p = new Promise((resolve, reject) => {
                  this.GetLastQuotation().subscribe(res => {
                    let id = 0;
                    if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
                    resolve(id);
                  });
                });              

                await p.then(async (v: number) => { 
                  console.log(prov.email);                
                  let quotation: Quotation = { 
                    date: '',
                    id: null,
                    petitioner: '',
                    email: '',
                    provider: '',
                    products: []
                  };
                  quotation.id = v;
                  quotation.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
                  quotation.provider = prov.name;
                  quotation.email = prov.email;
                  quotation.petitioner = 'Demo';
                  quotation.products.push(product);
                  this.db.list('blooming-erp/quotation-list').push(quotation);
                  //await new Promise((resolve, reject) => setTimeout(resolve, 3000));
                  //this.add(quotation, id_requisition); console.log('add', quotation.id);
                  //console.log('3sec');

                  const p2 = new Promise((resolve, reject) => {
                    this.apiR.GetRequisition(id_requisition).valueChanges().subscribe(requi => {
                      let quotations = [];
                      if(requi.quotations){
                        quotations = [...requi.quotations];
                      }
                      quotations.push(v);
                      resolve(quotations);
                    });
                  });
                  await p2.then((quotations: any[]) => {
                    this.db.object('blooming-erp/requisition-list/' + id_requisition).update({ 'quotations': quotations });
                  }); 
                });  */           
              //}
            });
          });
        }
      });
    });
    return this.quotations_;
  }

  add(quotation){
    this.db.database.ref().child('blooming-erp/quotation-list/'+ quotation.id).set(quotation);
  }

  addO(order){
    this.db.database.ref().child('blooming-erp/order-list/'+ order.id).set(order);
  }

  GetLastQuotation(){
    this.lastQuotationRef = this.db.list('blooming-erp/quotation-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastQuotationRef;
  }

  GetLastOrder(){
    this.lastOrderRef = this.db.list('blooming-erp/order-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastOrderRef;
  }
}
