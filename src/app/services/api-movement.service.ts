import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiMovementService {

  public movementList!: AngularFireList<any>;
  public movementObject!: AngularFireObject<any>;
  public lastMovementRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddMovement(movement: Movement) {
    this.db.database.ref().child(this.db_name + '/movement-list/'+ movement.id).set(movement);
    //this.db.list(this.db_name + '/movement-list').push(movement);
  }

  GetMovementList() {
    this.movementList = this.db.list(this.db_name + '/movement-list');
    return this.movementList;
  }

  GetMovement(key: string) {
    this.movementObject = this.db.object(this.db_name + '/movement-list/' + key);
    return this.movementObject;
  }

  GetLastMovement(){
    this.lastMovementRef = this.db.list(this.db_name + '/movement-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastMovementRef;
  }
}
