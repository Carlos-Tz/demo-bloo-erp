import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Provider } from '../models/provider';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiProviderService {
  
  public providerList!: AngularFireList<any>;
  public providerObject!: AngularFireObject<any>;
  public lastProviderRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddProvider(provider: Provider) {
    
    this.db.database.ref().child(this.db_name + '/provider-list/'+ provider.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child(this.db_name + '/provider-list/'+ provider.id).set(provider);
      return false;
    });
  }

  GetProviderList() {
    this.providerList = this.db.list(this.db_name + '/provider-list');
    return this.providerList;
  }

  GetProvider(key: string) {
    this.providerObject = this.db.object(this.db_name + '/provider-list/' + key);
    return this.providerObject;
  }

  UpdateProvider(provider: Provider, key: string) {
    this.db.object(this.db_name + '/provider-list/' + key)
    .update(provider);
  }

  DeleteProvider(key: string) {
    this.providerObject = this.db.object(this.db_name + '/provider-list/' + key);
    this.providerObject.remove();
  }

  GetLastProvider(){
    this.lastProviderRef = this.db.list(this.db_name + '/provider-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastProviderRef;
  }
}
