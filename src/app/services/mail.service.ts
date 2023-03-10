import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  //url='http://localhost:4200/';
  url='';

  constructor(private http: HttpClient, private helpS: HelpService) { 
    this.url = helpS.GetUrl();
  }
  mail_(mail: Object){
    //return this.http.post(`${this.url}mail.php`, JSON.stringify(mail));
    return this.http.post('mail.php', JSON.stringify(mail));
  }

  mailApplication(app: Object){
    let headers= new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    const httpOptions = {
      headers: headers
    };
    return this.http.post(`${this.url}resources/mail_application.php`, JSON.stringify(app), {responseType: 'text'});
    //return this.http.post('mail.php', JSON.stringify(mail));
  }

  mailNote(note: Object){
    return this.http.post(`${this.url}resources/mail_note.php`, JSON.stringify(note), {responseType: 'text'});
    //return this.http.post('mail.php', JSON.stringify(mail));
  }
}
