import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiApplicationService } from 'src/app/services/api-application.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';
import * as $ from 'jquery';
import { ApiCustomerService } from 'src/app/services/api-customer.service';
import 'fecha';
import fechaObj from 'fecha';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-application',
  templateUrl: './change-application.component.html',
  styleUrls: ['./change-application.component.css']
})
export class ChangeApplicationComponent implements OnInit {
  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  //public key = '';
  public cro: string[] = [];
  //public cus = "";
  public crops: any[] = [];
  public tab = false;
  public scheduled = 0;
  public indications: any[] = [];
  public customers: any[] = [];
  public ord = 0;
  public date = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiRa: ApiRanchService,
    public apiA: ApiApplicationService,
    public apiC: ApiCustomerService,
    public toastr: ToastrService,
    private actRouter: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    //this.key = this.actRouter.snapshot.paramMap.get('id');
    this.sForm();
    this.sForm1();
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    //this.myForm.patchValue({ date: new Date().toISOString() });
    this.apiA.GetApplication(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.myForm.patchValue({ 'address': '' });
      this.myForm.patchValue({ 'city': '' });
      this.myForm.patchValue({ 'customer': '' });
      //this.cus = data.customer.name;
      /* if(data.crops){
        data.crops.forEach(item => {
          //const c = item.payload.val();
          const cro = {'value': item, 'label': item};        
          this.crops.push(cro);
        });
        //this.crops = data.crops;
        
        this.cro = data.crops
      } */
      if(data.indications){
        this.indications = data.indications;
      }
    });
    this.apiC.GetCustomerList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        
        const c = item.payload.val();
        //if(c.status){
          const cus = c;/*  {'value': c, 'label': c.name};   */   
          //console.log(cus);
          this.customers.push(cus);
        //}
      });
    });

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
      customer: ['', [Validators.required]],
      status: [''],
      justification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      crops: [],
      indications: [],
    });
  }

  sForm1() {
    this.myForm1 = this.fb.group({
      id: [''],
      indication: ['',[Validators.required]],
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
  }

  submitSurveyData = () => {
    let indications_ : any[] = [];
    this.indications.forEach((c, i) => {
      //console.log(c);
      indications_.push({ id: i, indication: c.indication })
    });
    //console.log(indications_);
    this.myForm.patchValue({ 'indications': indications_ });
    this.myForm.patchValue({ date: this.date });
    this.myForm.patchValue({ status: 1 });
    this.apiA.GetLastApplication().subscribe(res=> {
      if(res[0]){
        this.ord = Number(res[0].id);
        this.myForm.patchValue({ id: this.ord + 1 });      
      } else {
        this.myForm.patchValue({ id: 1 });      
      }
    });
    //this.apiA.UpdateApplication(this.myForm.value, this.key)
    this.apiA.AddApplication(this.myForm.value);
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

