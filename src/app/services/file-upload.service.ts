import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import {Observable} from 'rxjs';
import { File } from '../models/file';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  //baseApiUrl = "https://file.io"
  public fileList!: AngularFireList<any>;
  public fileObject!: AngularFireObject<any>;
  public lastFileRef!: Observable<any[]>;
  private db_name = '';

  constructor(
    private db: AngularFireDatabase,
    public toastr: ToastrService,
    private helpS: HelpService
    //private http:HttpClient
    ) { 
      this.db_name = helpS.GetDbName();
    }
    
  // Returns an observable
  /* upload(file):Observable<any> {
  
      // Create form data
      const formData = new FormData(); 
        
      // Store form name as "file" with file data
      formData.append("file", file, file.name);
        
      // Make http post request over api
      // with formData as req
      return this.http.post(this.baseApiUrl, formData)
  } */
  GetFileList() {
    this.fileList = this.db.list(this.db_name + '/file-list');
    return this.fileList;
  }

  AddFile(file: File) {
    this.db.database.ref().child(this.db_name + '/file-list/'+ file.id).set(file);
  }

  GetFile(key: string) {
    this.fileObject = this.db.object(this.db_name + '/file-list/' + key);
    return this.fileObject;
  }

  GetLastFile(){
    this.lastFileRef = this.db.list(this.db_name + '/file-list/', ref => ref.limitToLast(1)).valueChanges();
    return this.lastFileRef;
  }

  DeleteFile(key: string) {
    this.fileObject = this.db.object(this.db_name + '/file-list/' + key);
    this.fileObject.remove();
  }
}
