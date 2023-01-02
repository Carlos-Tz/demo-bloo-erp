import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/services/api-product.service';
import 'fecha';
import fechaObj from 'fecha';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiApplicationService } from 'src/app/services/api-application.service';
import * as $ from 'jquery';
import { Customer } from 'src/app/models/customer';
import { ApiCustomerService } from 'src/app/services/api-customer.service';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.css']
})
export class NewApplicationComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public date = '';
  public dataSource = new MatTableDataSource<any>();
  public cro: string[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  public customers: Customer[] = [];
  public ord = 0;
  public crops: Select2Data = [];
  public indications: any[] = [];

  constructor(
    private fb: FormBuilder,
    public apiC: ApiCustomerService,
    public apiA: ApiApplicationService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.sForm1();
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    //this.myForm.patchValue({ date: new Date().toISOString() });
    this.myForm.patchValue({ date: this.date });
    //this.myForm.patchValue({ petitioner: 'Demo' });
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
    /* this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        if((p.category == 'FERTILIZANTES' || p.category == 'AGROQUIMICOS') && p.existence >= 0.01){
          const pro = {'value': item.key!, 'label': p.name, 'data': { 'existence': p.existence, 'unit': p.unit }};
          this.products.push(pro);
          //const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'avcost': p.avcost, 'category': p.category }
          //this.products1.push(p1);
        }
      });
    }); */

    this.apiA.GetLastApplication().subscribe(res=> {
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
      id_customer: ['', [Validators.required]],
      status: [1],
      justification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      crops: [],
    });
  }

  sForm1() {
    this.myForm1 = this.fb.group({
      id: [''],
      indication: ['',[Validators.required]],
    });
  }

  submitSurveyData = () => {
    /* let products_d = {};
    this.products1.forEach(p => {
      let sectors_d = {};
      this.sectors1.forEach(s => {
        if(!s.startsWith('sector__')){
          let n1: string = $('input#'+p.value+'__'+s+'__1').val().toString();
          let n2: string = $('input#'+p.value+'__'+s+'__2').val().toString();
          let nn1 = parseFloat(n1);
          let nn2 = parseFloat(n2);
          sectors_d[s] = { sector: nn1, dosis: nn2, delivered: false }
        }
      });
      products_d[p.value] = sectors_d
    });
    this.myForm.patchValue({ 'products': products_d }); */
    this.apiA.AddApplication(this.myForm.value);
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }


  customer(ev){
    console.log(ev.value);
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

  addIndication(){
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
  }
}
