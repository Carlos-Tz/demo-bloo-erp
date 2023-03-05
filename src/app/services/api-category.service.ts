import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireObject, AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Category } from '../models/category';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCategoryService {

  public lastOrden: number = 0;
  public categoryList!: AngularFireList<any>;
  public categoryObject!: AngularFireObject<any>;
  public lastCategoryRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage, public toastr: ToastrService,private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddCategory(category: Category) {
    
    this.db.database.ref().child(this.db_name + '/category-list/'+ category.id).once("value", snapshot => {
      if(snapshot.exists()){
        this.toastr.error('No guardado, ya existe un registro con este nombre!');
        return true;
      }
      //this.toastr.success('Guardado!');
      this.db.database.ref().child(this.db_name + '/category-list/'+ category.id).set(category);
      return false;
    });
  }
  
  GetCategoryList() {
    this.categoryList = this.db.list(this.db_name + '/category-list')
    return this.categoryList;
  }
  
  GetCategory(key: string) {
    this.categoryObject = this.db.object(this.db_name + '/category-list/' + key);
    return this.categoryObject;
  }

  UpdateCategory(category: Category, key: string) {
    this.db.object(this.db_name + '/category-list/' + key)
    .update(category);
  }

  DeleteCategory(key: string) {
    this.categoryObject = this.db.object(this.db_name + '/category-list/' + key);
    this.categoryObject.remove();
  }

  GetLastCategory(){
    this.lastCategoryRef = this.db.list(this.db_name + '/category-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastCategoryRef;
  }
}
