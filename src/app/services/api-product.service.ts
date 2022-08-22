import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ApiProductService {

  public productList!: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddProduct(product: Product) {
    this.db.list('ranchlook/product-list').push(product);
  }

  GetProductList() {
    this.productList = this.db.list('ranchlook/product-list');
    return this.productList;
  }
}
