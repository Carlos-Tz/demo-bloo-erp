import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import * as $ from 'jquery';
import 'fecha';
import fechaObj from 'fecha';
import { ApiMovementService } from 'src/app/services/api-movement.service';

@Component({
  selector: 'app-output-note',
  templateUrl: './output-note.component.html',
  styleUrls: ['./output-note.component.css']
})
export class OutputNoteComponent implements OnInit {

  public products: Select2Data = [];
  public myForm!: FormGroup;
  public products1: any[] = [];
  public pro: string[] = [];
  public customer = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiN: ApiNoteService,
    public apiP: ApiProductService,
    public apiM: ApiMovementService,
    public toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiN.GetNote(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.customer = data.customer.name;
      /* data.products.forEach(pp => {
      }); */
      for (const e in data.products) {
        this.pro.push(e);
        //console.log(e);
        const element = data.products[e];
        const pro = {'value': element.id, 'label': element.name, 'data': { 'iva': element.iva, 'quantity': element.quantity, 'unit': element.unit, 'cost': element.cost, 'presentation': element.presentation }};
        this.products.push(pro);
        /* if (Object.prototype.hasOwnProperty.call(ev.value.crops, e)) {
          const element = ev.value.crops[e];
          const cro = {'value': element, 'label': element};   
          this.crops.push(cro);
        } */
      }
      //this.pro = data.products;
    });
    /* this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        //if(p.existence >= 0.01){
          const pro = {'value': item.key!, 'label': p.name, 'data': { 'existence': p.existence, 'unit': p.unit, 'costs': p.costs, 'presentation': p.presentation }};
          this.products.push(pro);
          //const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'avcost': p.avcost, 'category': p.category }
          //this.products1.push(p1);
        //}
      });
    }); */
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [null],
      date: [''],
      customer: [''],
      status: [''],
      justification: [''],
      address: [''],
      city: [''],
      send: [''],
      paymentdate: [''],
      orderdate: [''],
      crops: [],
      products: [],
    });
  }

  updateP(ev){
    this.products1 = [...ev.options];
  }

  submitSurveyData = () => {
    let products_d = {};
    let complete = true;
    let movements = [];
    let existences = [];
    this.products1.forEach(p => {
      let id = $('input#id___'+p.value).val();
      let name = $('input#name___'+p.value).val();
      let q = 0;
      if ($('input#quantity___'+p.value).val()){
        q = parseFloat($('input#quantity___'+p.value).val().toString());
      }else {
        q = 0;
      }
      let unit = $('input#unit___'+p.value).val();
      let presentation = $('input#presentation___'+p.value).val();
      let comment = $('textarea#comment___'+p.value).val();
      let cost = parseFloat($('input#cost___'+p.value).val().toString()); 
      //console.log($('select#cost___'+p.value +' option:selected').val());
      
      let iva = $('input#iva___'+p.value).prop('checked');
      
      let output = $('input#output___'+p.value).prop('checked'); console.log(output);
      
      if(!output){
        complete = false;
      }

      if(q > 0 && output){
        let mo = {
          id: 0,
          id_req: '',
          id_app: '',
          id_note: this.data.id,
          date: fechaObj.format(new Date(), 'DD[/]MM[/]YYYY'),
          type: 'SALIDA',
          quantity: q,
          price: cost,
          id_prod: id,
          name_prod: name,
          category: ''
        }
        movements.push(mo);
        let ex = {
          id: p.value,
          quantity: q
        };
        existences.push(ex);
      }
      
      products_d[p.value] = { id: id, name: name, quantity: q, unit: unit, presentation: presentation, cost: cost, iva: iva, output: output, comment: comment  };
    });
    if(movements.length > 0){
      this.addMov(movements);
    }
    if(existences.length > 0){
      this.upExis(existences);
    }

    this.myForm.patchValue({ 'products': products_d });
    if(complete){
      this.myForm.patchValue({ 'status': 3 });
    }else{
      this.myForm.patchValue({ 'status': 2 });
    }
    //console.log(this.myForm.value);
    
    this.apiN.UpdateNote(this.myForm.value, this.data.id);
    this.ResetForm();
    this.toastr.success('Pedido entregado!');
  }

  async addMov(movements){
    const promise2 = new Promise((resolve, reject) => {
      this.apiM.GetLastMovement().subscribe(res => {
        let id = 0;
        if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
        resolve(id);
      });
    });
    await promise2.then((v: number) => {
      movements.forEach(m => {
        //console.log(m, v);
        m['id'] = v;
        this.apiM.AddMovement(m);
        v++;
      });
        //mov['id'] = v;
    });
  }

  upExis(existences){
    this.apiP.UpdateExistences(existences);
  }

  ResetForm() {
    this.myForm.reset();
  }

  allProducts(){
    this.products1.forEach(p => {

      $('input#output___'+p.value).prop('checked', true);
    });
    
  }
}
