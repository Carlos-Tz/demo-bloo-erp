import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService {

  public lastOrden: number = 0;
  public categoryList!: AngularFireList<any>;
  public categoryObject!: AngularFireObject<any>;
  public lastCategoryRef!: Observable<any[]>;
  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService) { }

  AddCategory(category: Category) {
    
    this.db.database.ref().child('blooming-erp/category-list/'+ category.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child('blooming-erp/category-list/'+ category.id).set(category);
      return false;
    });
  }
  
  GetCategoryList() {
    this.categoryList = this.db.list('blooming-erp/category-list')
    return this.categoryList;
  }
  
  GetCategory(key: string) {
    this.categoryObject = this.db.object('blooming-erp/category-list/' + key);
    return this.categoryObject;
  }

  UpdateCategory(category: Category, key: string) {
    this.db.object('blooming-erp/category-list/' + key)
    .update(category);
  }

  DeleteCategory(key: string) {
    this.categoryObject = this.db.object('blooming-erp/category-list/' + key);
    this.categoryObject.remove();
  }

  GetLastCategory(){
    this.lastCategoryRef = this.db.list('blooming-erp/category-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCategoryRef;
  }
}
