import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Presentation } from '../models/presentation';

@Injectable({
  providedIn: 'root'
})
export class ApiPresentationService {

  public lastOrden: number = 0;
  public presentationList!: AngularFireList<any>;
  public presentationObject!: AngularFireObject<any>;
  public lastPresentationRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService) { }

  AddPresentation(presentation: Presentation) {
    
    this.db.database.ref().child('blooming-erp/presentation-list/'+ presentation.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming-erp/presentation-list/'+ presentation.id).set(presentation);
      return false;
    });
  }
  
  GetPresentationList() {
    this.presentationList = this.db.list('blooming-erp/presentation-list')
    return this.presentationList;
  }
  
  GetPresentation(key: string) {
    this.presentationObject = this.db.object('blooming-erp/presentation-list/' + key);
    return this.presentationObject;
  }

  UpdatePresentation(presentation: Presentation, key: string) {
    this.db.object('blooming-erp/presentation-list/' + key)
    .update(presentation);
  }

  DeletePresentation(key: string) {
    this.presentationObject = this.db.object('blooming-erp/presentation-list/' + key);
    this.presentationObject.remove();
  }

  GetLastPresentation(){
    this.lastPresentationRef = this.db.list('blooming-erp/presentation-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastPresentationRef;
  }
}
