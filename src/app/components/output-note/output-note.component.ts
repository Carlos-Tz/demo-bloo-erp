import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ApiProductService } from 'src/app/services/api-product.service';

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
      crops: [],
      products: [],
    });
  }

  updateP(ev){
    this.products1 = [...ev.options];
  }
}
