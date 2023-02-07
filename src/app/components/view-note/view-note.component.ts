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
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.css']
})
export class ViewNoteComponent implements OnInit {

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
      }
      //this.pro = data.products;
    });
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
}
