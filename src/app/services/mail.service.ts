import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  //url='http://localhost:4200/';
  url='https://demo-erp.bloomingtec.mx/';

  constructor(private http: HttpClient) { }
  mail_(mail: Object){
    //return this.http.post(`${this.url}mail.php`, JSON.stringify(mail));
    return this.http.post('mail.php', JSON.stringify(mail));
  }

  mailApplication(app: Object){
    return this.http.post(`${this.url}resources/mail_application.php`, JSON.stringify(app));
    //return this.http.post('mail.php', JSON.stringify(mail));
  }
}
