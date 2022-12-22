import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ApiOrdersService {

  public orderList!: AngularFireList<any>;
  public orderObject!: AngularFireObject<any>;
  public lastOrderRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private http: HttpClient) { }

  GetOrdersList() {
    this.orderList = this.db.list('blooming-erp/order-list');
    return this.orderList;
  }

  GetOrder(key: string) {
    this.orderObject = this.db.object('blooming-erp/order-list/' + key);
    return this.orderObject;
  }

  UpdateOrder(order: Order, key: number) {
    this.db.object('blooming-erp/order-list/' + key).update(order);
  }

  excel(data: any, url: string): Observable<any>{
    return this.http.post<any>(`${url}debtsToPay.php`, { orders: data });
  }
}
