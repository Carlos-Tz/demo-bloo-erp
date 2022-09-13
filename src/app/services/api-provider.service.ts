import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class ApiProviderService {
  
  public providerList!: AngularFireList<any>;
  public providerObject!: AngularFireObject<any>;
  public lastProviderRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddProvider(provider: Provider) {
    
    this.db.database.ref().child('blooming/provider-list/'+ provider.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming/provider-list/'+ provider.id).set(provider);
      return false;
    });
  }

  GetProviderList() {
    this.providerList = this.db.list('blooming/provider-list');
    return this.providerList;
  }

  GetProvider(key: string) {
    this.providerObject = this.db.object('blooming/provider-list/' + key);
    return this.providerObject;
  }

  UpdateProvider(provider: Provider, key: string) {
    this.db.object('blooming/provider-list/' + key)
    .update(provider);
  }

  DeleteProvider(key: string) {
    this.providerObject = this.db.object('blooming/provider-list/' + key);
    this.providerObject.remove();
  }

  GetLastProvider(){
    this.lastProviderRef = this.db.list('blooming/provider-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastProviderRef;
  }
}
