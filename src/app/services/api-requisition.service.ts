import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Requisition } from '../models/requisition';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiRequisitionService {

  public requisitionList!: AngularFireList<any>;
  public requisitionObject!: AngularFireObject<any>;
  public lastRequisitionRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddRequisition(requisition: Requisition) {
    this.db.database.ref().child(this.db_name + '/requisition-list/'+ requisition.id).set(requisition);
    //this.db.list(this.db_name + '/requisition-list').push(requisition);
  }

  GetRequisitionList() {
    this.requisitionList = this.db.list(this.db_name + '/requisition-list');
    return this.requisitionList;
  }

  GetRequisition(key: string) {
    this.requisitionObject = this.db.object(this.db_name + '/requisition-list/' + key);
    return this.requisitionObject;
  }

  GetLastRequisition(){
    this.lastRequisitionRef = this.db.list(this.db_name + '/requisition-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastRequisitionRef;
  }

  UpdateRequisition(requisition: Requisition, key: string) {
    this.requisitionObject
    .update(requisition);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object(this.db_name + '/requisition-list/' + key + '/products/' + index).update(pro);
    /* this.requisitionObject
    .update(requisition); */
  }

  DeleteRequisition(key: string) {
    this.requisitionObject = this.db.object(this.db_name + '/requisition-list/' + key);
    this.requisitionObject.remove();
  }
}
