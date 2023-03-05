import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Company } from '../models/company';
import { HelpService } from './help.service';

@Injectable({
  providedIn: 'root'
})
export class ApiCompanyService {

  private db_name = '';
  public companyObject!: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase, public toastr: ToastrService, private helpS: HelpService) {
    this.db_name = helpS.GetDbName();
   }

  UpdateCompary(company: Company) {
    this.db.database.ref().child(this.db_name + '/company/company_id').set(company);
    //this.toastr.success('Guardado!');
    return false;
  }

  GetCompany() {
    this.companyObject = this.db.object(this.db_name + '/company/company_id');
    return this.companyObject;
  }
}
