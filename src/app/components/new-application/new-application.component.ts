import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/services/api-product.service';
import 'fecha';
import fechaObj from 'fecha';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Ranch } from 'src/app/models/ranch';
import { ApiRanchService } from 'src/app/services/api-ranch.service';
import { ApiApplicationService } from 'src/app/services/api-application.service';

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
  public sec: string[] = [];
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  //public categories: Select2Data = [];
  //public providers: Select2Data = [];
  public ranches: Ranch[] = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  public sectors1: any[] = [];
  //public products_l: any[] = [];
  //public displayedColumns = ['product', 'quantity'];
  public ord = 0;
  public sectors: Select2Data = [];


  constructor(
    private fb: FormBuilder,
    //public apiR: ApiRequisitionService,
    //public apiC: ApiCicleService,
    public apiRa: ApiRanchService,
    public apiA: ApiApplicationService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
    public authService: AuthService, 
  ) { }

  ngOnInit(): void {
    this.sForm();
    
    this.sForm1();
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    //this.myForm.patchValue({ date: new Date().toISOString() });
    this.myForm.patchValue({ date: this.date });
    //this.myForm.patchValue({ petitioner: 'Demo' });
    this.apiRa.GetRanchList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const r = item.payload.val();
        if(r.status){
          const ran = {'id': r.id, 'status': r.status, 'sectors': []};        
          this.ranches.push(ran);
        }
      });
    });
    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        if(p.category == 'FERTILIZANTES' || p.category == 'AGROQUIMICOS'){
          const pro = {'value': item.key!, 'label': p.name};
          this.products.push(pro);
          //const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'avcost': p.avcost, 'category': p.category }
          //this.products1.push(p1);
        }
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
      id_ranch: ['', [Validators.required]],
      status: [1],
      justification: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
    });
  }
  sForm1() {
    this.myForm1 = this.fb.group({
      product: ['',[Validators.required]],
      quantity: ['', [Validators.required]]
    });
  }

  submitSurveyData = () => {
    //this.apiP.AddProduct(this.myForm.value);
    //this.myForm.patchValue({ products: this.products_l });
    //this.apiR.AddRequisition(this.myForm.value);
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }

  /* addProduct(){
    const p = this.products1.find(e => e.key === this.myForm1.get('product')!.value);
    p['quantity'] = this.myForm1.get('quantity')!.value;
    if (this.products_l.find(e => e.key === this.myForm1.get('product')!.value)) {
      this.products_l = this.products_l.map(e => e.key !== this.myForm1.get('product')!.value ? e : p);
    }else {
      this.products_l.push(p);
    }
    this.myForm1.reset();
  }

  editPro(key: string, quantity: number){
    this.myForm1.patchValue({ product: key , quantity: quantity})
  }

  deletePro(key: string){
    const index = this.products_l.findIndex((object) => {
      return object.key === key;
    });
    
    if (index !== -1) {
      this.products_l.splice(index, 1);
    }
  } */

  ranch(ev){
    //console.log(ev.value);
    this.sectors = [];
    this.apiRa.GetRanch(ev.value).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      if(data.sectors){
        for (const e in data.sectors) {
          if (Object.prototype.hasOwnProperty.call(data.sectors, e)) {
            const element = data.sectors[e];
            const sec = {'value': element.id, 'label': element.name};   
            this.sectors.push(sec);
          }
        }
      }
    });
    /* this.apiPv.GetProviderList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const p = item.payload.val();
        const pro = {'value': p.id, 'label': p.name};        
        this.providers.push(pro);
      });
    }); */
  }

  allSec(){
    this.sec = [];
    this.sectors.forEach(e => this.sec.push(e['value']));
  }

  updateS(ev){
    //this.sectors1 = ev.value.map((e, i) => e)
    this.sectors1 = ev.value.flatMap((e, i) => [e,i])
    console.log(this.sectors1);
    //this.sectors1 = [...ev.value];
  }

  updateP(ev){
    console.log(ev.value);
    this.products1 = [...ev.value];
  }
}
