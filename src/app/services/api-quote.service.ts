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

  constructor(
    private db: AngularFireDatabase,
    private apiP: ApiProductService,
    private apiPr: ApiProviderService,
    private apiR: ApiRequisitionService
    ) { }

  AddQuotation(product: any, id_requisition: any) {
    this.apiP.GetProduct(product.key).valueChanges().subscribe(prod => {
      if(prod.providers){
        prod.providers.forEach(element => {
          console.log(this.GetLastQuotationId());
          this.apiPr.GetProvider(element).valueChanges().subscribe(prov => {
            if(prov.email){
              console.log(prov.email);
              
              let quotation: Quotation = { 
                date: '',
                id: null,
                petitioner: '',
                email: '',
                provider: '',
                products: []
              };
              quotation.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
              quotation.provider = prov.name;
              quotation.email = prov.email;
              quotation.petitioner = 'Demo';
              quotation.products.push(product);
              /* const last = this.GetLastQuotation();
              last.subscribe(res => {
                if(res[0]){
                  quotation.id = Number(res[0].id) + 1;
                } else {
                  quotation.id = 1;
                }
                console.log(quotation.id);
                this.add(quotation, id_requisition);
              }); */

              
              /* this.GetLastQuotation().subscribe(res => {
                if(res[0]){
                  quotation.id = Number(res[0].id) + 1;
                } else {
                  quotation.id = 1;
                }
                this.db.database.ref().child('blooming/quotation-list/'+ quotation.id).set(quotation);
                this.apiR.GetRequisition(id_requisition).valueChanges().subscribe(requi => {
                  let quotations = [];
                  //if(requi.quotations){
                  //  quotations = requi.quotations;
                  //}
                  quotations.push(quotation.id);
                  this.db.object('blooming/requisition-list/' + id_requisition).update({ 'quotations': quotations });
                });
              }); */
            }//else return 0;
          });    
        });
      } //return 2;
    }); //return 1;
  }

  add(quotation, id){
    this.db.database.ref().child('blooming/quotation-list/'+ quotation.id).set(quotation);
  }

  GetLastQuotation(){
    this.lastQuotationRef = this.db.list('blooming/quotation-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastQuotationRef;
  }

  GetLastQuotationId(){
    let id: number = 0;
    let li = this.db.list('blooming/quotation-list/', ref => ref.limitToLast(1));
    let r = li.valueChanges().subscribe(res => {
      if(res[0]){
        id = Number(res[0]['id']) + 1;
        //console.log(id);
        return id;
        //return Number(res[0]); 
      }else {
        id = 1;
        //console.log(id);
        return id;
        //return 1;
      }
    });
    console.log(r);
    
    return id;
  }
}
