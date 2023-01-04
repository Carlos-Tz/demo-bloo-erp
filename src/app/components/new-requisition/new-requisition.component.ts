import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiProductService } from 'src/app/services/api-product.service';
import 'fecha';
import fechaObj from 'fecha';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { Cicle } from 'src/app/models/cicle';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-requisition',
  templateUrl: './new-requisition.component.html',
  styleUrls: ['./new-requisition.component.css']
})
export class NewRequisitionComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public date = '';
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  //public categories: Select2Data = [];
  //public providers: Select2Data = [];
  public cicles: Cicle[] = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  public products_l: any[] = [];
  public displayedColumns = ['product', 'quantity'];
  public ord = 0;

  constructor(
    private fb: FormBuilder,
    public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
    public authService: AuthService, 
  ) { }

  ngOnInit(): void {
    this.sForm();//console.log(this.authService.userName)
    
    this.sForm1();
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    //this.myForm.patchValue({ date: new Date().toISOString() });
    this.myForm.patchValue({ date: this.date });
    this.myForm.patchValue({ petitioner: 'Demo' });
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
        const p1 = { 'key': item.key, 'name': p.name, 'unit': p.unit, 'category': p.category }
        //p['key'] = item.key;        
        this.products1.push(p1);
      });
    });

    this.apiR.GetLastRequisition().subscribe(res=> {
      if(res[0]){
        this.ord = Number(res[0].id);
        this.myForm.patchValue({ id: this.ord + 1 });      
      } else {
        this.myForm.patchValue({ id: 1 });      
      }
    });

    /* if (this.products_l.length > 0) {
      this.dataSource.data = this.products_l.slice();
    } */
    /* Pagination */
    /* setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 0); */
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [null, [Validators.required]],
      date: ['', [Validators.required]],
      cicle: ['', [Validators.required]],
      priority: [null, [Validators.required]],
      status: [1],
      justification: ['', [Validators.required]],
      petitioner: ['', [Validators.required]],
      comments: [''],
      authorizationdate: [''],
      products: [],
      quotations: [],
      orders: [],
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
    this.myForm.patchValue({ products: this.products_l });
    this.apiR.AddRequisition(this.myForm.value);
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }

  addProduct(){
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
  }

}
