import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiQuoteService } from 'src/app/services/api-quote.service';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { AssignProviderComponent } from '../assign-provider/assign-provider.component';
import 'fecha';
import fechaObj from 'fecha';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public products = [];
  public quotations_ = [];
  public date = '';
  public complete = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    public apiR: ApiRequisitionService,
    public apiQ: ApiQuoteService,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiR.GetRequisition(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.products = data.products;
      //console.log(data.products);
      this.complete = this.products.every((element) => {
        if(element.provider) return true;
        else return false;
      });      
      
      //this.quotations_ = this.apiQ.AddQuotation(this.products);
    });
    this.apiC.GetCicleList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const c = item.payload.val();
        if(c.status){
          const cic = {'id': c.id, 'status': c.status};        
          this.cicles.push(cic);
        }
      });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [''],
      date: [''],
      cicle: [''],
      priority: [''],
      status: [''],
      justification: [''],
      petitioner: [''],
      comments: [''],
      authorizationdate: [''],
      products: [],
      quotations: [],
      orders: []
    });
  }

  async purchase_order() {
    //console.log('ok');
    
    const p = new Promise((resolve, reject) => {
      this.apiQ.GetLastOrder().subscribe(res => {
        let id = 0;
        if(res[0]){ id = Number(res[0].id) + 1; } else { id = 1; }
        resolve(id);
      });
    });              

    await p.then(async (v: number) => { 
      const o_l = [];
      for (let i = 0; i < this.products.length; i++) {
        const e = this.products[i];
        let oo = e;
        oo['id'] = v++;
        oo['key_r'] = this.data.id;
        oo['orderdate'] = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
        oo['status'] = 1;
        oo['status_reception'] = 1;
        oo['quantity_received'] = 0;
        oo['quantity_remaining'] = e.quantity;
        oo['balance'] = (e.quantity*e.price*e.iva + e.quantity*e.price);
        oo['paidout'] = 0;
        oo['cicle'] = this.myForm.get('cicle').value;
        oo['category'] = e.category;
        this.apiQ.addO(oo);
        o_l.push(oo);
      }
      //console.log(o_l);
      this.myForm.patchValue({ status: 5 });
      this.myForm.patchValue({ orders: o_l });
      this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
      this.toastr.success('Requisición pedida!');
    });
  }

  openDialog(id_r: number, pro: any, id: number) {
    const dialogRef = this.dialog.open(AssignProviderComponent, {
      data: {
        id_r: id_r,
        pro: pro,
        id: id
      }
    });
  }
}

