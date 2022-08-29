import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Requisition } from '../models/requisition';

@Injectable({
  providedIn: 'root'
})
export class ApiRequisitionService {

  public requisitionList!: AngularFireList<any>;
  public requisitionObject!: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddRequisition(requisition: Requisition) {
    this.db.list('ranchlook/requisition-list').push(requisition);
  }

  GetRequisitionList() {
    this.requisitionList = this.db.list('ranchlook/requisition-list');
    return this.requisitionList;
  }

  GetRequisition(key: string) {
    this.requisitionObject = this.db.object('ranchlook/requisition-list/' + key);
    return this.requisitionObject;
  }

  UpdateRequisition(requisition: Requisition, key: string) {
    this.requisitionObject
    .update(requisition);
  }

  DeleteRequisition(key: string) {
    this.requisitionObject = this.db.object('ranchlook/requisition-list/' + key);
    this.requisitionObject.remove();
  }
}
