import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class ApiCompanyService {

  public companyObject!: AngularFireObject<any>;
  constructor(private db: AngularFireDatabase, public toastr: ToastrService) { }

  UpdateCompary(company: Company) {
    this.db.database.ref().child('blooming-erp/company/company_id').set(company);
    //this.toastr.success('Guardado!');
    return false;
  }

  GetCompany() {
    this.companyObject = this.db.object('blooming-erp/company/company_id');
    return this.companyObject;
  }
}
