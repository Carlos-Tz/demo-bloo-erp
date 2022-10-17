import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscriber, Subscription } from 'rxjs';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiQuoteService } from 'src/app/services/api-quote.service';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { MailService } from 'src/app/services/mail.service';
//import 'fecha';
//import fechaObj from 'fecha';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements  OnInit, OnDestroy {
  sq: Subscription;
  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public products = [];
  public quotations_ = [];
  public date = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    public apiR: ApiRequisitionService,
    public apiQ: ApiQuoteService,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
    public mail: MailService
  ) { }

  ngOnInit(): void {
    this.mail.mail_({ email: 'nine2one@live.com.mx' }).subscribe(data => {
      if(data){
        console.log(data);
      }
    });
    this.sForm();
    this.apiR.GetRequisition(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.products = data.products;
      this.quotations_ = this.apiQ.AddQuotation(this.products);
    });
    this.apiC.GetCicleList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const c = item.payload.val();
        if(c.status){
          const cic = {'id': c.id, 'status': c.status};        
          this.cicles.push(cic);
        }
      });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [''],
      date: [''],
      cicle: [''],
      priority: [''],
      status: [''],
      justification: [''],
      petitioner: [''],
      comments: [''],
      authorizationdate: [''],
      products: [],
      quotations: []
    });
  }

  async quote() {
    const p = new Promise((resolve, reject) => {
      this.apiQ.GetLastQuotation().subscribe(res => {
        let id = 0;
        if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
        resolve(id);
      });
    });              

    await p.then(async (v: number) => { 
      const q_l = [];
      for (let i = 0; i < this.quotations_.length; i++) {
        const e = this.quotations_[i];
        let qq = e;
        qq['id'] = v++;
        this.apiQ.add(qq);
        q_l.push(qq);
      }
      console.log(q_l);
      this.myForm.patchValue({ status: 4 });
      this.myForm.patchValue({ quotations: q_l });
      this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
      this.toastr.success('Requisición cotizada!');
    })/* .then( () => {
      this.quotations_ = [];
      this.sq.unsubscribe();
    }) */;
  }
  ngOnDestroy() {
    //this.quotations_ = [];
    
    //this.sq.unsubscribe();
    console.log('des');
    
  }
}
