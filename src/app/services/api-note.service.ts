import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Note } from '../models/note';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiNoteService {

  public noteList!: AngularFireList<any>;
  public noteObject!: AngularFireObject<any>;
  public lastNoteRef!: Observable<any[]>;
  private db_name = '';

  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private http: HttpClient, private helpS: HelpService) { 
    this.db_name = helpS.GetDbName();
  }

  AddNote(note: Note) {
    this.db.database.ref().child(this.db_name + '/note-list/'+ note.id).set(note);
    //this.db.list(this.db_name + '/note-list').push(note);
  }

  GetNoteList() {
    this.noteList = this.db.list(this.db_name + '/note-list');
    return this.noteList;
  }

  GetNote(key: string) {
    this.noteObject = this.db.object(this.db_name + '/note-list/' + key);
    return this.noteObject;
  }

  GetLastNote(){
    this.lastNoteRef = this.db.list(this.db_name + '/note-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastNoteRef;
  }

  UpdateNote(note: Note, key: string) {
    this.db.object(this.db_name + '/note-list/' + key).update(note);
    //this.noteObject
    //.update(note);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object(this.db_name + '/note-list/' + key + '/products/' + index).update(pro);
    /* this.noteObject
    .update(note); */
  }

  DeleteNote(key: string) {
    this.noteObject = this.db.object(this.db_name + '/note-list/' + key);
    this.noteObject.remove();
  }

  excel(data: any, url: string): Observable<any>{
    return this.http.post<any>(`${url}resources/debtsToCollect.php`, { orders: data });
  }
}
