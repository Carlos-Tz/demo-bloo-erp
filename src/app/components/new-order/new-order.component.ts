import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiQuoteService } from 'src/app/services/api-quote.service';
import 'fecha';
import fechaObj from 'fecha';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public providers: Select2Data = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  constructor(
    private fb: FormBuilder,
    //public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
    public apiQ: ApiQuoteService,
    //public authService: AuthService, 
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiC.GetCicleList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const c = item.payload.val();
        if(c.status){
          const cic = {'id': c.id, 'status': c.status};        
          this.cicles.push(cic);
        }
      });
    });
    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        const pro = {'value': item.key!, 'label': p.name};
        this.products.push(pro);
        const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'avcost': p.avcost, 'category': p.category }
        //p['key'] = item.key;        
        this.products1.push(p1);
      });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      provider: ['', [Validators.required]],
      price: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      avcost: [null, [Validators.required]],
      key: ['', [Validators.required]],
      name: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      unit: ['', [Validators.required]],
      category: ['', [Validators.required]],
      cicle: ['', [Validators.required]],
      key_r: [''],
      id: [''],
      orderdate: [''],
      quantity_received: [''],
      quantity_remaining: [''],
      status: [''],
      status_reception: [''],
      balance: [''],
      paidout: [''],
      folio: [''],
      paymentdate: [''],
      paymenttype: [''],
      payments: []
    });
  }

  async submitSurveyData() {
    const p = new Promise((resolve, reject) => {
      this.apiQ.GetLastOrder().subscribe(res => {
        let id = 0;
        if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
        resolve(id);
      });
    });   

    await p.then(async (v: number) => { 
      let quantity_l = this.myForm.get('quantity').value;
      let price_l = this.myForm.get('price').value;
      let iva_l = this.myForm.get('iva').value;
      this.myForm.patchValue({ 'id': v });
      this.myForm.patchValue({ 'key_r': 0 });
      this.myForm.patchValue({ 'orderdate': fechaObj.format(new Date(), 'DD[/]MM[/]YYYY') });
      this.myForm.patchValue({ 'status': 1 });
      this.myForm.patchValue({ 'status_reception': 1 });
      this.myForm.patchValue({ 'quantity_received': 0 });
      this.myForm.patchValue({ 'quantity_remaining': quantity_l });
      this.myForm.patchValue({ 'paidout': 0 });
      this.myForm.patchValue({ 'balance': (quantity_l*price_l*iva_l + quantity_l*price_l) });
      this.apiQ.addO(this.myForm.value)
      this.toastr.success('Orden guardada!');
    });
  }

  changeP(ev){
    if(ev.value){
      this.providers = [];
      this.myForm.patchValue({ 'provider': '' });
      this.apiP.GetProduct(ev.value).valueChanges().subscribe(data => {
        this.myForm.patchValue({ 'name': data.name });
        this.myForm.patchValue({ 'avcost': data.avcost });
        this.myForm.patchValue({ 'unit': data.unit });
        this.myForm.patchValue({ 'category': data.category });

        data.providers.forEach(item => {
          //const p = item.payload.val();
          const pro = {'value': item, 'label': item};
          this.providers.push(pro);
        });
      });
    }
  }

  ResetForm() {
    this.myForm.reset();
  }

}
