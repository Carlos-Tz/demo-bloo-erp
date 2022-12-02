import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { ApiQuoteService } from 'src/app/services/api-quote.service';
//import 'fecha';
//import fechaObj from 'fecha';

@Component({
  selector: 'app-debts-to-pay',
  templateUrl: './debts-to-pay.component.html',
  styleUrls: ['./debts-to-pay.component.css']
})
export class DebtsToPayComponent implements OnInit {

  public myForm!: FormGroup;
  public providers: Provider[];
  public orders: Provider[];
  constructor(
    private fb: FormBuilder,
    public apiP: ApiProviderService,
    public apiO: ApiOrdersService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiP.GetProviderList().snapshotChanges().subscribe(data => {
      this.providers = [];
      data.forEach(item => {
        const o = item.payload.val();
        this.providers.push(o as Provider);
      });
      this.myForm.patchValue({ 'providers': this.providers });
    });
    this.apiO.GetOrdersList().snapshotChanges().subscribe(data => {
      this.orders = [];
      data.forEach(item => {
        const o = item.payload.val();
        if(o.status > 1){
          this.orders.push(o as Provider);
        }
      });
      this.myForm.patchValue({ 'orders': this.orders });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      initial_date: ['', [Validators.required]],
      final_date: ['', [Validators.required]],
      orders: [],
      providers: [],
    }, {validator: this.dateLessThan('initial_date', 'final_date')});
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
     let f = group.controls[from];
     let t = group.controls[to];
     if (f.value > t.value) {
       return {
         dates: "La fecha inicial debe ser menor a la fecha final!."
       };
     }
     return {};
    }
  }

  submitSurveyData() {
    //this.apiQ.addO(this.myForm.value)
    //this.toastr.success('Orden guardada!');
    console.log(this.myForm.value);
    let url='http://localhost:4200/';
    return this.http.post(`${url}debtsToPay.php`, JSON.stringify({}));
    
    
  }

  ResetForm() {
    this.myForm.reset();
  }

}
