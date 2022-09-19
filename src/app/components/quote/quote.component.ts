import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiQuoteService } from 'src/app/services/api-quote.service';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
//import 'fecha';
//import fechaObj from 'fecha';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements  OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public products = [];
  public date = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiR: ApiRequisitionService,
    public apiQ: ApiQuoteService,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiR.GetRequisition(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.products = data.products;
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

  quote = () => {
    this.myForm.get('products').value.forEach(element => {
      //console.log(element);
      this.apiQ.AddQuotation(element, this.data.id);
    });
    /* this.myForm.patchValue({ status: 4 });
    this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
    this.toastr.success('Requisición cotizada!'); */
  }
}
