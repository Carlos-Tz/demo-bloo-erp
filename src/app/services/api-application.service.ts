import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Application } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class ApiApplicationService {

  public applicationList!: AngularFireList<any>;
  public applicationObject!: AngularFireObject<any>;
  public lastApplicationRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddApplication(application: Application) {
    this.db.database.ref().child('blooming/application-list/'+ application.id).set(application);
    //this.db.list('blooming/application-list').push(application);
  }

  GetApplicationList() {
    this.applicationList = this.db.list('blooming/application-list');
    return this.applicationList;
  }

  GetApplication(key: string) {
    this.applicationObject = this.db.object('blooming/application-list/' + key);
    return this.applicationObject;
  }

  GetLastApplication(){
    this.lastApplicationRef = this.db.list('blooming/application-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastApplicationRef;
  }

  UpdateApplication(application: Application, key: string) {
    this.applicationObject
    .update(application);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object('blooming/application-list/' + key + '/products/' + index).update(pro);
    /* this.applicationObject
    .update(application); */
  }

  DeleteApplication(key: string) {
    this.applicationObject = this.db.object('blooming/application-list/' + key);
    this.applicationObject.remove();
  }
}
