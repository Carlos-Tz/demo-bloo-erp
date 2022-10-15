import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import 'fecha';
import fechaObj from 'fecha';

@Component({
  selector: 'app-authorize-requisition',
  templateUrl: './authorize-requisition.component.html',
  styleUrls: ['./authorize-requisition.component.css']
})
export class AuthorizeRequisitionComponent implements OnInit {

  public myForm!: FormGroup;
  public cicles: Cicle[] = [];
  public products = [];
  public date = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiR.GetRequisition(this.data.id).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.products = data.products;
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
      orders: [],
    });
  }

  vobo = () => {
    this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
    this.myForm.patchValue({ authorizationdate: this.date });
    this.myForm.patchValue({ status: 2 });
    this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
    this.toastr.success('Requisición autorizada!');
  }

  decline = () => {
    this.myForm.patchValue({ status: 3 })
    this.apiR.UpdateRequisition(this.myForm.value, this.data.id);
    this.toastr.warning('Requisición rechazada!');
  }

}
