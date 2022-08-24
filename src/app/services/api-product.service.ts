import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {

  public productList!: AngularFireList<any>;
  public productObject!: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddProduct(product: Product) {
    this.db.list('ranchlook/product-list').push(product);
  }

  GetProductList() {
    this.productList = this.db.list('ranchlook/product-list');
    return this.productList;
  }

  GetProduct(key: string) {
    this.productObject = this.db.object('ranchlook/product-list/' + key);
    return this.productObject;
  }

  UpdateProduct(product: Product, key: string) {
    //this.db.object('ranchlook/product-list/' + key)
    this.productObject
    .update(product);
  }

  DeleteProduct(key: string) {
    this.productObject = this.db.object('ranchlook/product-list/' + key);
    this.productObject.remove();
  }
}
