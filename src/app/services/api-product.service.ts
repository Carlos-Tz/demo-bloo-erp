import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {

  public productList!: AngularFireList<any>;
  public productObject!: AngularFireObject<any>;
  public lastProductRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddProduct(product: Product) {
    this.db.database.ref().child(this.db_name + '/product-list/'+ product.id).set(product);
    //this.db.list(this.db_name + '/product-list').push(product);
  }

  GetProductList() {
    this.productList = this.db.list(this.db_name + '/product-list');
    return this.productList;
  }

  GetProduct(key: string) {
    this.productObject = this.db.object(this.db_name + '/product-list/' + key);
    return this.productObject;
  }

  GetLastProduct(){
    this.lastProductRef = this.db.list(this.db_name + '/product-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastProductRef;
  }

  UpdateProduct(product: Product) {
    //this.db.object(this.db_name + '/product-list/' + key)
    this.productObject
    .update(product);
  }

  UpdateExistences(existences: any[]){
    existences.forEach(async e => {
      const promise3 = new Promise((resolve, reject) => {
        this.GetProduct(e.id).valueChanges().subscribe(res => {
            //resolve(res);
            let prod = res;
            let existence_c = res.existence; 
            let existence_n = existence_c - e.quantity;
            prod['existence'] = existence_n;
            //console.log(prod);
            resolve(prod);
        });
      });
      await promise3.then(async (pro: Product) => {
        const promise4 = new Promise((resolve, reject) => {
          let ob : AngularFireObject<any> = this.db.object(this.db_name + '/product-list/' + pro.id);
          ob.update(pro).then(e => {
            resolve(e)
          })
        });
        await promise4.then((e: any) => {
          //console.log(e);
        });
      });
    }); 
  }

  DeleteProduct(key: string) {
    this.productObject = this.db.object(this.db_name + '/product-list/' + key);
    this.productObject.remove();
  }
}
