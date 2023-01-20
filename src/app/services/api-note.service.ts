import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Note } from '../models/note';

@Injectable({
  providedIn: 'root'
})
export class ApiNoteService {

  public noteList!: AngularFireList<any>;
  public noteObject!: AngularFireObject<any>;
  public lastNoteRef!: Observable<any[]>;

  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  AddNote(note: Note) {
    this.db.database.ref().child('blooming-erp/note-list/'+ note.id).set(note);
    //this.db.list('blooming-erp/note-list').push(note);
  }

  GetNoteList() {
    this.noteList = this.db.list('blooming-erp/note-list');
    return this.noteList;
  }

  GetNote(key: string) {
    this.noteObject = this.db.object('blooming-erp/note-list/' + key);
    return this.noteObject;
  }

  GetLastNote(){
    this.lastNoteRef = this.db.list('blooming-erp/note-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastNoteRef;
  }

  UpdateNote(note: Note, key: string) {
    this.noteObject
    .update(note);
  }

  AssignProvider(key: string, pro: any, index: number) {
    this.db.object('blooming-erp/note-list/' + key + '/products/' + index).update(pro);
    /* this.noteObject
    .update(note); */
  }

  DeleteNote(key: string) {
    this.noteObject = this.db.object('blooming-erp/note-list/' + key);
    this.noteObject.remove();
  }
}
