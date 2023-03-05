import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  private url='https://demo-erp.bloomingtec.mx/';
  private bd_name = 'blooming-erp';
  constructor() { }

  GetUrl(){
    return this.url;
  }
  GetDbName(){
    return this.bd_name;
  }
}
