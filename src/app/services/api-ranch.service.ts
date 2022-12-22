import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Ranch } from '../models/ranch';
import { Sector } from '../models/sector';

@Injectable({
  providedIn: 'root'
})
export class ApiRanchService {
  public ranchList!: AngularFireList<any>;
  public ranchObject!: AngularFireObject<any>;
  public lastRanchRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService) { }

  AddRanch(ranch: Ranch) {
    this.db.database.ref().child('blooming-erp/ranch-list/'+ ranch.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming-erp/ranch-list/'+ ranch.id).set(ranch);
      return false;
    });
  }

  AddSector(id: string, se: Sector){
    this.db.database.ref().child('blooming-erp/ranch-list/'+ id + '/sectors/' + se.id).set(se);
      return true;
  }
  
  GetRanchList() {
    this.ranchList = this.db.list('blooming-erp/ranch-list')
    return this.ranchList;
  }
  
  GetRanch(key: string) {
    this.ranchObject = this.db.object('blooming-erp/ranch-list/' + key);
    return this.ranchObject;
  }

  UpdateRanch(ranch: Ranch, key: string) {
    this.db.object('blooming-erp/ranch-list/' + key)
    .update(ranch);
  }

  DeleteRanch(key: string) {
    this.ranchObject = this.db.object('blooming-erp/ranch-list/' + key);
    this.ranchObject.remove();
  }

  GetLastRanch(){
    this.lastRanchRef = this.db.list('blooming-erp/ranch-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastRanchRef;
  }
}
