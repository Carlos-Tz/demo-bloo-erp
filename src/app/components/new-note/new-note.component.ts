import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/services/api-product.service';
import 'fecha';
import fechaObj from 'fecha';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as $ from 'jquery';
import { Customer } from 'src/app/models/customer';
import { ApiCustomerService } from 'src/app/services/api-customer.service';
import { ApiNoteService } from 'src/app/services/api-note.service';

@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.css']
})
export class NewNoteComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public date = '';
  public dataSource = new MatTableDataSource<any>();
  public cro: string[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  public customers: Customer[] = [];
  public ord = 0;
  public crops: Select2Data = [];
  public products: Select2Data = [];
  //public indications: any[] = [];
  public products1: any[] = [];
  public scheduled = 0;

  constructor(
    private fb: FormBuilder,
    public apiC: ApiCustomerService,
    public apiN: ApiNoteService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.sForm1();
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    this.myForm.patchValue({ date: this.date });
    this.apiC.GetCustomerList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const c = item.payload.val();
        //if(c.status){
          const cus = c;/* {'id': c.id, 'crops': c.crops}; */        
          this.customers.push(cus);
        //}
      });
    });

    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        if(p.existence >= 0.01){
          const pro = {'value': item.key!, 'label': p.name, 'data': { 'existence': p.existence, 'unit': p.unit, 'costs': p.costs, 'presentation': p.presentation }};
          this.products.push(pro);
          //const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'avcost': p.avcost, 'category': p.category }
          //this.products1.push(p1);
        }
      });
    });

    this.apiN.GetLastNote().subscribe(res=> {
      if(res[0]){
        this.ord = Number(res[0].id);
        this.myForm.patchValue({ id: this.ord + 1 });      
      } else {
        this.myForm.patchValue({ id: 1 });      
      }
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [null, [Validators.required]],
      date: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      status: [1],
      justification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      crops: [],
      products: [],
    });
  }

  sForm1() {
    this.myForm1 = this.fb.group({
      id: [''],
      product: ['',[Validators.required]],
    });
  }

  submitSurveyData = () => {
    let products_d = {};
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
      let cost = parseFloat($('select#cost___'+p.value +' option:selected').val().toString()); 
      //console.log($('select#cost___'+p.value +' option:selected').val());
      
      let iva = $('input#iva___'+p.value).prop('checked');
      
      products_d[p.value] = { id: id, name: name, quantity: q, unit: unit, presentation: presentation, cost: cost, iva: iva  };
    });
    this.myForm.patchValue({ 'products': products_d })
    this.apiN.AddNote(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Pedido guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

  updateP(ev){
    this.products1 = [...ev.options];
  }

  customer(ev){
    //console.log(ev.value);
    this.myForm.patchValue({ 'address': ev.value.street + ' # ' + ev.value.num + ' ' + ev.value.colony});
    this.myForm.patchValue({ 'city': ev.value.city });
    /* this.crops = [];
    this.apiC.GetCustomer(ev.value).valueChanges().subscribe(data => {
      if(data.crops){*/
        for (const e in ev.value.crops) {
          if (Object.prototype.hasOwnProperty.call(ev.value.crops, e)) {
            const element = ev.value.crops[e];
            const cro = {'value': element, 'label': element};   
            this.crops.push(cro);
          }
        }
      /*}
    }); */
  }

  allCrops(){
    this.cro = [];
    this.crops.forEach(e => this.cro.push(e['value']));
  }

  focus1(pro: any){
    //console.log(pro.data.existence);
    
    this.scheduled = 0;
    this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const r = item.payload.val();
        if(r.status < 3){ 
          if(r.products){          
            Object.entries(r.products).forEach(([key, value], index) => {              
              if(key == pro.value){
                if(value['quantity'] > 0){
                  //console.log(value['quantity']);
                  this.scheduled += value['quantity'];
                }
                
                //Object.entries(value).forEach(([k,v], i) => {
                  //console.log(v);
                  
                  /* if(!v.delivered){
                    //console.log(v.sector, r);
                    this.scheduled += v.sector;
                  } */
                //});
              }
              
            });
          }
        }   
      });
      //$('#scheduled').val(scheduled.toFixed(2));
      //$('#available').val((pro.data.existence - parseFloat($('#scheduled').val().toString())).toFixed(2));
      $('#available').val((pro.data.existence - this.scheduled).toFixed(2));
    });
    //console.log(this.scheduled);
    console.log(parseFloat($('#scheduled').val().toString()));

    $('#exis').show();
    $('#existence').val(pro.data.existence.toFixed(2));
    $('#unit').html(pro.data.unit);
    $('#unit1').html(pro.data.unit);
    $('#unit2').html(pro.data.unit);
  }

  change1(ev){
    console.log(ev.srcElement.value);
    
  }

  blur1(){
    $('#exis').hide();
  }

 /*  addIndication(){
    if (this.indications.find(e => e.id === this.myForm1.get('id')!.value)) {
      const c = this.indications.find(e => e.id === this.myForm1.get('id')!.value);
      c['indication'] = this.myForm1.get('indication')!.value;
      this.indications = this.indications.map(e => e.id !== this.myForm1.get('id')!.value ? e : c);
    }else {
      const c = {};
      if(this.indications.length > 0){
        c['id'] = this.indications[this.indications.length - 1].id + 1;
      }else{
        c['id'] = 1;
      }
      c['indication'] = this.myForm1.get('indication')!.value;
      this.indications.push(c);
    }
    this.myForm1.reset();
  }

  editIndication(id: string, indication: string){
    this.myForm1.patchValue({ id: id , indication: indication})
  }

  deleteIndication(id: string){
    const index = this.indications.findIndex((object) => {
      return object.id === id;
    });
    
    if (index !== -1) {
      this.indications.splice(index, 1);
    }
  } */
}

