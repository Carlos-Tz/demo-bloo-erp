import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Presentation } from '../models/presentation';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiPresentationService {

  private db_name = '';
  public lastOrden: number = 0;
  public presentationList!: AngularFireList<any>;
  public presentationObject!: AngularFireObject<any>;
  public lastPresentationRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddPresentation(presentation: Presentation) {
    
    this.db.database.ref().child(this.db_name + '/presentation-list/'+ presentation.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child(this.db_name + '/presentation-list/'+ presentation.id).set(presentation);
      return false;
    });
  }
  
  GetPresentationList() {
    this.presentationList = this.db.list(this.db_name + '/presentation-list')
    return this.presentationList;
  }
  
  GetPresentation(key: string) {
    this.presentationObject = this.db.object(this.db_name + '/presentation-list/' + key);
    return this.presentationObject;
  }

  UpdatePresentation(presentation: Presentation, key: string) {
    this.db.object(this.db_name + '/presentation-list/' + key)
    .update(presentation);
  }

  DeletePresentation(key: string) {
    this.presentationObject = this.db.object(this.db_name + '/presentation-list/' + key);
    this.presentationObject.remove();
  }

  GetLastPresentation(){
    this.lastPresentationRef = this.db.list(this.db_name + '/presentation-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastPresentationRef;
  }
}
