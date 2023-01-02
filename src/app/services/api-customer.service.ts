import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class ApiCustomerService {

  public customerList!: AngularFireList<any>;
  public customerObject!: AngularFireObject<any>;
  public lastCustomerRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddCustomer(customer: Customer) {
    
    this.db.database.ref().child('blooming-erp/customer-list/'+ customer.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming-erp/customer-list/'+ customer.id).set(customer);
      return false;
    });
  }

  GetCustomerList() {
    this.customerList = this.db.list('blooming-erp/customer-list');
    return this.customerList;
  }

  GetCustomer(key: string) {
    this.customerObject = this.db.object('blooming-erp/customer-list/' + key);
    return this.customerObject;
  }

  UpdateCustomer(customer: Customer, key: string) {
    this.db.object('blooming-erp/customer-list/' + key)
    .update(customer);
  }

  DeleteCustomer(key: string) {
    this.customerObject = this.db.object('blooming-erp/customer-list/' + key);
    this.customerObject.remove();
  }

  GetLastCustomer(){
    this.lastCustomerRef = this.db.list('blooming-erp/customer-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCustomerRef;
  }
}
