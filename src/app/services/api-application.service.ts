import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Application } from '../models/application';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiApplicationService {

  public applicationList!: AngularFireList<any>;
  public applicationObject!: AngularFireObject<any>;
  public lastApplicationRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) {
    this.db_name = helpS.GetDbName();
   }

  AddApplication(application: Application) {
    this.db.database.ref().child(this.db_name + '/application-list/'+ application.id).set(application);
    //this.db.list(this.db_name + '/application-list').push(application);
  }

  GetApplicationList() {
    this.applicationList = this.db.list(this.db_name + '/application-list');
    return this.applicationList;
  }

  GetApplication(key: string) {
    this.applicationObject = this.db.object(this.db_name + '/application-list/' + key);
    return this.applicationObject;
  }

  GetLastApplication(){
    this.lastApplicationRef = this.db.list(this.db_name + '/application-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastApplicationRef;
  }

  UpdateApplication(application: Application, key: string) {
    this.applicationObject
    .update(application);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object(this.db_name + '/application-list/' + key + '/products/' + index).update(pro);
    /* this.applicationObject
    .update(application); */
  }

  DeleteApplication(key: string) {
    this.applicationObject = this.db.object(this.db_name + '/application-list/' + key);
    this.applicationObject.remove();
  }
}
