import { Component, OnInit, ViewChild, Inject} from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-duplicate-note',
  templateUrl: './duplicate-note.component.html',
  styleUrls: ['./duplicate-note.component.css']
})
export class DuplicateNoteComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public date = '';
  public key = '';
  public dataSource = new MatTableDataSource<any>();
  public cro: string[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  public customers: Customer[] = [];
  public ord = 0;
  public crops: Select2Data = [];
  public pro: string[] = [];
  public products: Select2Data = [];
  //public indications: any[] = [];
  public products1: any[] = [];
  public products2: any[] = [];
  public customer1 = '';
  public scheduled = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiC: ApiCustomerService,
    public apiN: ApiNoteService,
    private actRouter: ActivatedRoute,
    public apiP: ApiProductService,
    public toastr: ToastrService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    //this.key = this.actRouter.snapshot.paramMap.get('id');
    this.sForm();
    this.sForm1();
    this.apiN.GetNote(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      //this.myForm.patchValue({ 'justification': data.justification });
      this.myForm.patchValue({ 'iva': 0 });
      this.myForm.patchValue({ 'subtotal': 0 });
      this.myForm.patchValue({ 'total': 0 });
      this.myForm.patchValue({ 'date': '' });
      this.myForm.patchValue({ 'customer': '' });
      this.myForm.patchValue({ 'status': 1 });
      this.myForm.patchValue({ 'address': '' });
      this.myForm.patchValue({ 'city': '' });
      this.myForm.patchValue({ 'send': false });
      this.myForm.patchValue({ 'signed': false });
      this.myForm.patchValue({ 'complete': false });
      this.myForm.patchValue({ 'paymentdate': '' });
      this.myForm.patchValue({ 'folio': '' });
      this.myForm.patchValue({ 'paymenttype': '' });
      this.myForm.patchValue({ 'orderdate': '' });
      this.myForm.patchValue({ 'url_sign': '' });
      this.myForm.patchValue({ 'date_sign': '' });
      this.myForm.patchValue({ 'name_sign': '' });
      this.myForm.patchValue({ 'user': '' });
      this.myForm.patchValue({ 'crops': [] });
      this.myForm.patchValue({ 'products': [] });
      this.myForm.patchValue({ 'balance': '' });
      this.myForm.patchValue({ 'paidout': 0 });
      this.myForm.patchValue({ 'payments': [] });

      //this.myForm.patchValue({ 'address': '' });
      //this.myForm.patchValue({ 'city': '' });
      //this.myForm.patchValue({ 'customer': '' });
      //$('#customer1').val(data.customer.name);
      //this.customer(data.customer)
      /* for (const e in data.crops) {
        this.cro.push(data.crops[e]);
      } */
      for (const e in data.products) {
        this.pro.push(e);
        //console.log(data.products[e]);
        this.products2.push(data.products[e])
      };
      //this.products2 = data.products;
    });
    
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
          const pro = {'value': item.key!, 'label': p.name, 'data': { 'iva': p.iva, 'id': p.id, 'quantity': p.quantity, 'existence': p.existence, 'unit': p.unit, 'costs': p.costs, 'presentation': p.presentation }};
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
      id: ['', [Validators.required]],
      iva: [''],
      subtotal: [''],
      total: [''],
      date: [''],
      customer: ['', [Validators.required]],
      status: [''],
      justification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      send: [false],
      signed: [false],
      complete: [false],
      paymentdate: [''],
      folio: [''],
      paymenttype: [''],
      orderdate: [''],
      url_sign: [''],
      date_sign: [''],
      name_sign: [''],
      user: [''],
      crops: [],
      products: [],
      balance: [''],
      paidout: [''],
      payments: [],
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
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    this.myForm.patchValue({ date: this.date });
    this.myForm.patchValue({ status: 1 });
    this.myForm.patchValue({ user: this.authService.userName });
    this.myForm.patchValue({ 'products': products_d });
    this.apiN.AddNote(this.myForm.value);
    //this.apiN.UpdateNote(this.myForm.value, this.data.id);
    this.ResetForm();
    this.toastr.success('Pedido duplicado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

  updateP(ev){
    this.products1 = [...ev.options];
    /* this.products1.forEach(p => {
      $('input#quantity___'+p.value).val(p.quantity);
      console.log($('input#quantity___'+p.value).val());
      
    }); */
  }

  async changeId(){

    const promise6 = new Promise((resolve, reject) => {
      //this.scheduled = 0;
      let ns_ = [];
      this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
        data.forEach(item => {
          const r = item.payload.val();
          if(r.status < 3 ){
             ns_.push(r);
          }   
        });
        resolve(ns_);
      });
    });
    await promise6.then((ns: any[]) => {
      this.products2.forEach(p => {
        let ex = 0;
        let sch = 0;
        let p_c = this.products.find(p_ => {
          return p_.data.id == p.id
        });
        if(p_c){
          ex = p_c.data['existence'];
        }
        //console.log(ex);
        ns.forEach(n => {
          if(n.products){
            Object.entries(n.products).forEach(([key, value], index) => {      
              if(key == p.id && value['quantity'] > 0){ 
                sch += value['quantity'];
              }
            });
          }
        });
        console.log(sch);
        let av = ex - sch;
        if(av >= p.quantity){
          $('input#quantity___'+p.id).val(parseFloat(p.quantity));
        }else{
          $('input#quantity___'+p.id).val(0);
        }
        $('select#cost___'+p.id).val(p.cost);
        if(p.iva){ 
          $('input#iva___'+p.id).prop( "checked", true );
        }

      });
      
    });

  }

  customer(ev){
    //console.log(ev.value);
    this.myForm.patchValue({ 'address': ev.value.street + ' # ' + ev.value.num + ' ' + ev.value.colony});
    this.myForm.patchValue({ 'city': ev.value.city });
    this.crops = [];
    /*this.apiC.GetCustomer(ev.value).valueChanges().subscribe(data => {
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
    console.log(this.myForm.value);
    
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
        if(r.status < 3 /* && r.id != this.data.id */){ 
          if(r.products){          
            Object.entries(r.products).forEach(([key, value], index) => {              
              if(key == pro.value){
                if(value['quantity'] > 0){
                  //console.log(value['quantity']);
                  this.scheduled += value['quantity'];
                }
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
    //console.log(parseFloat($('#scheduled').val().toString()));

    $('#exis').show();
    $('#existence').val(pro.data.existence.toFixed(2));
    $('#unit').html(pro.data.unit);
    $('#unit1').html(pro.data.unit);
    $('#unit2').html(pro.data.unit);
  }

  change1(ev){
    //console.log(ev.src.value);
    
    if(parseFloat(ev.srcElement.value) > parseFloat($('#available').val().toString())){
      $('input#'+ ev.srcElement.id).val(0);
    }
  }

  blur1(){
    $('#exis').hide();
  }

}


