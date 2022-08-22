import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Provider } from '../models/provider';

@Injectable({
  providedIn: 'root'
})
export class ApiProviderService {
  
  public providerList!: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddProvider(provider: Provider) {
    
    this.db.database.ref().child('ranchlook/provider-list/'+ provider.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      this.toastr.success('Guardado!');
      this.db.database.ref().child('ranchlook/provider-list/'+ provider.id).set(provider);
      return false;
    });
  }

  GetProviderList() {
    this.providerList = this.db.list('ranchlook/provider-list');
    return this.providerList;
  }
}
