import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCustomerService {

  public customerList!: AngularFireList<any>;
  public customerObject!: AngularFireObject<any>;
  public lastCustomerRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddCustomer(customer: Customer) {
    
    this.db.database.ref().child(this.db_name + '/customer-list/'+ customer.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child(this.db_name + '/customer-list/'+ customer.id).set(customer);
      return false;
    });
  }

  GetCustomerList() {
    this.customerList = this.db.list(this.db_name + '/customer-list');
    return this.customerList;
  }

  GetCustomer(key: string) {
    this.customerObject = this.db.object(this.db_name + '/customer-list/' + key);
    return this.customerObject;
  }

  UpdateCustomer(customer: Customer, key: string) {
    this.db.object(this.db_name + '/customer-list/' + key)
    .update(customer);
  }

  DeleteCustomer(key: string) {
    this.customerObject = this.db.object(this.db_name + '/customer-list/' + key);
    this.customerObject.remove();
  }

  GetLastCustomer(){
    this.lastCustomerRef = this.db.list(this.db_name + '/customer-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCustomerRef;
  }
}
