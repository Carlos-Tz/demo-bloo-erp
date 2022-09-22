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
  public providers = [];

  constructor(
    private db: AngularFireDatabase,
    private apiP: ApiProductService,
    private apiPr: ApiProviderService,
    private apiR: ApiRequisitionService
    ) { }

  AddQuotation(product: any, id_requisition: any) {
    this.apiP.GetProduct(product.key).valueChanges().subscribe(prod => {
      if(prod.providers){
        /* this.providers = [...prod.providers];
        for (const p in this.providers) {
          if (Object.prototype.hasOwnProperty.call(this.providers, p)) {
            const element = this.providers[p];
            console.log(element);
            this.apiPr.GetProvider(element).valueChanges().subscribe(prov => {
              if(prov.email){
                console.log(prov.email);
                
              }
            });
          }
        } */
        prod.providers.forEach(element => {
          this.apiPr.GetProvider(element).valueChanges().subscribe(async prov => {
            if(prov.email){
              /* const lastQ = async (id_: number): Promise<number> => {
                const p = await new Promise<number>((resolve, reject) => {
                  let id = 0;
                  this.GetLastQuotation().subscribe(res => {
                    if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
                  });
                  resolve(id);
                })
                return p;
              }
              console.log(lastQ); */
              /* const last = (id: number) => {
                const p = new Promise<number>((resolve, reject) => {
                  this.GetLastQuotation().subscribe(res => {
                    let id_ = 0;
                    if(res[0]){ id_ = Number(res[0].id) + 1; } else { id_ = 1; }
                    console.log('ok');
                    
                    resolve(id_)
                  })
                })
                return p;
              }
              console.log(last); */



              
              
              //await new Promise((resolve, reject) => setTimeout(resolve, 3000));
              const p = new Promise((resolve, reject) => {
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
                this.db.list('blooming/quotation-list').push(quotation);
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
                  this.db.object('blooming/requisition-list/' + id_requisition).update({ 'quotations': quotations });
                }); 
              });            
            }
          });
        });
      }
    });
  }

  add(quotation, id){
    this.db.database.ref().child('blooming/quotation-list/'+ quotation.id).set(quotation);
  }

  GetLastQuotation(){
    this.lastQuotationRef = this.db.list('blooming/quotation-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastQuotationRef;
  }
}
