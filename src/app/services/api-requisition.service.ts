import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Requisition } from '../models/requisition';

@Injectable({
  providedIn: 'root'
})
export class ApiRequisitionService {

  public requisitionList!: AngularFireList<any>;
  public requisitionObject!: AngularFireObject<any>;
  public lastRequisitionRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddRequisition(requisition: Requisition) {
    this.db.database.ref().child('blooming-erp/requisition-list/'+ requisition.id).set(requisition);
    //this.db.list('blooming-erp/requisition-list').push(requisition);
  }

  GetRequisitionList() {
    this.requisitionList = this.db.list('blooming-erp/requisition-list');
    return this.requisitionList;
  }

  GetRequisition(key: string) {
    this.requisitionObject = this.db.object('blooming-erp/requisition-list/' + key);
    return this.requisitionObject;
  }

  GetLastRequisition(){
    this.lastRequisitionRef = this.db.list('blooming-erp/requisition-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastRequisitionRef;
  }

  UpdateRequisition(requisition: Requisition, key: string) {
    this.requisitionObject
    .update(requisition);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object('blooming-erp/requisition-list/' + key + '/products/' + index).update(pro);
    /* this.requisitionObject
    .update(requisition); */
  }

  DeleteRequisition(key: string) {
    this.requisitionObject = this.db.object('blooming-erp/requisition-list/' + key);
    this.requisitionObject.remove();
  }
}
