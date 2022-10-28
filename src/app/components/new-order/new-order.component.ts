import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiProductService } from 'src/app/services/api-product.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  constructor(
    private fb: FormBuilder,
    //public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
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
      key_r: ['', [Validators.required]],
      id: ['', [Validators.required]],
      orderdate: ['', [Validators.required]],
      quantity_received: ['', [Validators.required]],
      quantity_remaining: ['', [Validators.required]],
      status: ['', [Validators.required]],
      status_reception: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      paidout: ['', [Validators.required]],
      folio: [''],
      paymentdate: [''],
      paymenttype: [''],
      payments: []
    });
  }

  submitSurveyData = () => {
    //this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    //this.apiPr.AddProvider(this.myForm.value);
    //this.apiR.AssignProvider(this.data.id_r, this.myForm.value, this.data.id)
    //this.ResetForm();
    this.toastr.success('Orden guardada!');
  }

  changeP(ev){
    if(ev.value){
      console.log(ev.value); 
    }
    
  }

  ResetForm() {
    this.myForm.reset();
  }

}
