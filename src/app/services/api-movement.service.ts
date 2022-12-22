import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement';

@Injectable({
  providedIn: 'root'
})
export class ApiMovementService {

  public movementList!: AngularFireList<any>;
  public movementObject!: AngularFireObject<any>;
  public lastMovementRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddMovement(movement: Movement) {
    this.db.database.ref().child('blooming-erp/movement-list/'+ movement.id).set(movement);
    //this.db.list('blooming-erp/movement-list').push(movement);
  }

  GetMovementList() {
    this.movementList = this.db.list('blooming-erp/movement-list');
    return this.movementList;
  }

  GetMovement(key: string) {
    this.movementObject = this.db.object('blooming-erp/movement-list/' + key);
    return this.movementObject;
  }

  GetLastMovement(){
    this.lastMovementRef = this.db.list('blooming-erp/movement-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastMovementRef;
  }
}
