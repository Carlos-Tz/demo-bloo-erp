import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Cicle } from '../models/cicle';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCicleService {
  public cicleList!: AngularFireList<any>;
  public cicleObject!: AngularFireObject<any>;
  public lastCicleRef!: Observable<any[]>; 
  private db_name = '';
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddCicle(cicle: Cicle) {
    this.db.database.ref().child(this.db_name + '/cicle-list/'+ cicle.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child(this.db_name + '/cicle-list/'+ cicle.id).set(cicle);
      return false;
    });
    //this.db.list(this.db_name + '/cicle-list').push(cicle);
  }
  
  GetCicleList() {
    this.cicleList = this.db.list(this.db_name + '/cicle-list')
    return this.cicleList;
  }
  
  GetCicle(key: string) {
    this.cicleObject = this.db.object(this.db_name + '/cicle-list/' + key);
    return this.cicleObject;
  }

  UpdateCicle(cicle: Cicle, key: string) {
    this.db.object(this.db_name + '/cicle-list/' + key)
    .update(cicle);
  }

  DeleteCicle(key: string) {
    this.cicleObject = this.db.object(this.db_name + '/cicle-list/' + key);
    this.cicleObject.remove();
  }

  GetLastCicle(){
    this.lastCicleRef = this.db.list(this.db_name + '/cicle-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCicleRef;
  }
}
