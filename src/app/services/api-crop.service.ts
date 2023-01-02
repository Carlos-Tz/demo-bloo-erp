import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Crop } from '../models/crop';

@Injectable({
  providedIn: 'root'
})
export class ApiCropService {

  public lastOrden: number = 0;
  public cropList!: AngularFireList<any>;
  public cropObject!: AngularFireObject<any>;
  public lastCropRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService) { }

  AddCrop(crop: Crop) {
    
    this.db.database.ref().child('blooming-erp/crop-list/'+ crop.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming-erp/crop-list/'+ crop.id).set(crop);
      return false;
    });
  }
  
  GetCropList() {
    this.cropList = this.db.list('blooming-erp/crop-list')
    return this.cropList;
  }
  
  GetCrop(key: string) {
    this.cropObject = this.db.object('blooming-erp/crop-list/' + key);
    return this.cropObject;
  }

  UpdateCrop(crop: Crop, key: string) {
    this.db.object('blooming-erp/crop-list/' + key)
    .update(crop);
  }

  DeleteCrop(key: string) {
    this.cropObject = this.db.object('blooming-erp/crop-list/' + key);
    this.cropObject.remove();
  }

  GetLastCrop(){
    this.lastCropRef = this.db.list('blooming-erp/crop-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCropRef;
  }
}
