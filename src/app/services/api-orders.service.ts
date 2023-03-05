import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiOrdersService {

  public orderList!: AngularFireList<any>;
  public orderObject!: AngularFireObject<any>;
  public lastOrderRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private http: HttpClient, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  GetOrdersList() {
    this.orderList = this.db.list(this.db_name + '/order-list');
    return this.orderList;
  }

  GetOrder(key: string) {
    this.orderObject = this.db.object(this.db_name + '/order-list/' + key);
    return this.orderObject;
  }

  UpdateOrder(order: Order, key: number) {
    this.db.object(this.db_name + '/order-list/' + key).update(order);
  }

  excel(data: any, url: string): Observable<any>{
    return this.http.post<any>(`${url}resources/debtsToPay.php`, { orders: data });
  }
}
