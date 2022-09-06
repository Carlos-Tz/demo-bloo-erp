import { Component, OnInit, ViewChild } from '@angular/core';
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
  public products_l: any = [];
  public displayedColumns = ['product', 'quantity'];

  constructor(
    private fb: FormBuilder,
    public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.sForm1();
    //this.date = fechaObj.format(new Date(), 'D [/] MM [/] YYYY');
    this.myForm.patchValue({ date: new Date().toISOString() });
    this.apiC.GetCicleList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const c = item.payload.val();
        const cic = {'id': c.id, 'status': c.status};        
        this.cicles.push(cic);
      });
    });
    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        const pro = {'value': item.key!, 'label': p.name};        
        this.products.push(pro);
      });
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
      products: [],
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
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }

  addProduct(){
    //this.products_l = this.products_l.concat([this.myForm1.value]);
    //this.products_l.push(this.myForm1.value);
    if ( this.myForm1.value && !this.products_l.includes(this.myForm1.value)) {
      this.products_l.push(this.myForm1.value);
      //this.dataSource.data = this.products_l.slice();
    }
    console.log(this.products_l);
    this.myForm1.reset();
    
  }

}
