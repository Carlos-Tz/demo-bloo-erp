import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from 'src/app/models/order';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { HelpService } from 'src/app/services/help.service';
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
  public orders: Order[];
  constructor(
    private fb: FormBuilder,
    public apiP: ApiProviderService,
    public apiO: ApiOrdersService,
    private http: HttpClient,
    private helpS: HelpService
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
          this.orders.push(o as Order);
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
      //providers: [],
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
    //let url='http://localhost:8080/local/dev/adm/php-back/';
    //let url='https://demo-erp.bloomingtec.mx/resources/';
    let url = this.helpS.GetUrl();
    let n_orders: any[] = this.orders.filter((e) => {
      return e.paymentdate >= this.myForm.get('initial_date').value && e.paymentdate <= this.myForm.get('final_date').value
    });
    let nn_orders: any[] = [];
    n_orders.forEach(o => {
      const p = this.providers.filter((pro) => {
          return pro['id'] == o.provider;
      });
      let n_o = o;
      n_o['provider_name'] = p[0]['name'];
      nn_orders.push(n_o);
    });
    this.myForm.patchValue({ 'orders': nn_orders });
    //console.log(nn_orders);
    
    this.apiO.excel(nn_orders, url).subscribe(res => {
      //console.log(res);
      window.location.href = `${url}resources/cuentasXpagar.xlsx`;
    }, err => {
      console.log(err);
    });
    
  }

  ResetForm() {
    this.myForm.reset();
  }

}
