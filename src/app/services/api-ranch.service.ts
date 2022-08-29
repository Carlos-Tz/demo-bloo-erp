import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Ranch } from '../models/ranch';

@Injectable({
  providedIn: 'root'
})
export class ApiRanchService {
  public ranchList!: AngularFireList<any>;
  public ranchObject!: AngularFireObject<any>;
  public lastRanchRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService) { }

  AddRanch(ranch: Ranch) {
    this.db.database.ref().child('ranchlook/ranch-list/'+ ranch.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      this.toastr.success('Guardado!');
      this.db.database.ref().child('ranchlook/ranch-list/'+ ranch.id).set(ranch);
      return false;
    });
  }
  
  GetRanchList() {
    this.ranchList = this.db.list('ranchlook/ranch-list')
    return this.ranchList;
  }
  
  GetRanch(key: string) {
    this.ranchObject = this.db.object('ranchlook/ranch-list/' + key);
    return this.ranchObject;
  }

  UpdateRanch(ranch: Ranch, key: string) {
    this.db.object('ranchlook/ranch-list/' + key)
    .update(ranch);
  }

  DeleteRanch(key: string) {
    this.ranchObject = this.db.object('ranchlook/ranch-list/' + key);
    this.ranchObject.remove();
  }

  GetLastRanch(){
    this.lastRanchRef = this.db.list('ranchlook/ranch-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastRanchRef;
  }
}
