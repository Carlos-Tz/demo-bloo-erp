import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {

  public productList!: AngularFireList<any>;
  public productObject!: AngularFireObject<any>;
  public lastProductRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddProduct(product: Product) {
    this.db.database.ref().child('blooming/product-list/'+ product.id).set(product);
    //this.db.list('blooming/product-list').push(product);
  }

  GetProductList() {
    this.productList = this.db.list('blooming/product-list');
    return this.productList;
  }

  GetProduct(key: string) {
    this.productObject = this.db.object('blooming/product-list/' + key);
    return this.productObject;
  }

  GetLastProduct(){
    this.lastProductRef = this.db.list('blooming/product-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastProductRef;
  }

  UpdateProduct(product: Product, key: string) {
    //this.db.object('blooming/product-list/' + key)
    this.productObject
    .update(product);
  }

  DeleteProduct(key: string) {
    this.productObject = this.db.object('blooming/product-list/' + key);
    this.productObject.remove();
  }
}
