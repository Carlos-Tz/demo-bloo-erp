import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import 'fecha';
import fechaObj from 'fecha';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiMovementService } from 'src/app/services/api-movement.service';
import { Movement } from 'src/app/models/movement';
import { ApiProductService } from 'src/app/services/api-product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-receive-order',
  templateUrl: './receive-order.component.html',
  styleUrls: ['./receive-order.component.css']
})
export class ReceiveOrderComponent implements OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  //public products = [];
  public date = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiM: ApiMovementService,
    public apiO: ApiOrdersService,
    public apiC: ApiCicleService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiO.GetOrder(this.data.order.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.myForm.patchValue({ 'quantity_received': data.quantity_remaining });
      //this.products = data.products;
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
      id: [null],
      avcost: [null],
      iva: [null],
      key: [''],
      key_r: [''],
      name: [''],
      orderdate: [''],
      price: [null],
      provider: [''],
      quantity: [null],
      quantity_received: [null],
      quantity_remaining: [null],
      unit: [''],
      folio: [null],
      paymentdate: [''],
      paymenttype: [''],
      status: [null],
      status_reception: [null],
      cicle: [''],
      category: [''],
      balance: [null],
      paidout: [null],
      payments: []
    });
  }

  async receive() {
    //this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    const p = new Promise((resolve, reject) => {
      this.apiM.GetLastMovement().subscribe(res => {
        let id = 0;
        if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
        resolve(id);
      });
    });              
    let quantity = this.myForm.get('quantity_remaining').value;
    let quantity_received = this.myForm.get('quantity_received').value;
    let price = this.myForm.get('price').value;
    let iva = this.myForm.get('iva').value;
    let key_r = this.myForm.get('key_r').value;
    let key = this.myForm.get('key').value;
    let name = this.myForm.get('name').value;
    let category = this.myForm.get('category').value;
    if(quantity == quantity_received || quantity < quantity_received){
      this.myForm.patchValue({ 'status_reception': 3 });
      this.myForm.patchValue({ 'quantity_remaining': 0 });
      this.myForm.patchValue({ 'quantity_received': this.myForm.get('quantity').value - this.myForm.get('quantity_remaining').value });
  
      await p.then((v: number) => { 
          let mo = {
            id: v++,
            id_req: key_r,
            id_app: '',
            id_note: '',
            date: fechaObj.format(new Date(), 'YYYY[-]MM[-]DD'),
            type: 'ENTRADA',
            quantity: quantity,
            price: price,
            id_prod: key,
            name_prod: name,
            category: category
          }
          this.apiM.AddMovement(mo);
      });
    } /* else if(quantity < quantity_received){
      this.myForm.patchValue({ 'status_reception': 3 });
      this.myForm.patchValue({ 'quantity_remaining': 0 });
    } */
    else{
      this.myForm.patchValue({ 'status_reception': 2 });
      this.myForm.patchValue({ 'quantity_remaining': quantity - quantity_received });
      this.myForm.patchValue({ 'quantity_received': this.myForm.get('quantity').value - this.myForm.get('quantity_remaining').value });
      await p.then(async (v: number) => { 
        let mo = {
          id: v++,
          id_req: key_r,
          id_app: '',
          id_note: '',
          date: fechaObj.format(new Date(), 'YYYY[-]MM[-]DD'),
          type: 'ENTRADA',
          quantity: quantity_received,
          price: price,
          id_prod: key,
          name_prod: name,
          category: category
        }
        this.apiM.AddMovement(mo);
    });
    }
    const p1 = new Promise((resolve, reject) => {
      this.apiP.GetProduct(key).valueChanges().subscribe(res => {
          resolve(res);
      });
    });
    await p1.then(async (pro: Product) => {
      let prod = pro;
      let existence_c = pro.existence; 
      //let avcost_c = pro.avcost;
      let avcost_c = 0;
      let existence_n = existence_c + quantity_received;
      let price_c = price + price*iva;
      let avcost_n = (avcost_c*existence_c + quantity_received*price_c) / existence_n; 
      prod['avcost'] = avcost_n;
      prod['existence'] = existence_n; console.log(prod);
      
      this.apiP.UpdateProduct(prod);
      //this.apiM.AddMovement(mo);
    });
    this.apiO.UpdateOrder(this.myForm.value, this.data.order.id);
    this.toastr.success('Orden recibida!');
  }

  /* decline = () => {
    this.myForm.patchValue({ status: 3 })
    this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
    this.toastr.warning('Requisición rechazada!');
  } */

}
