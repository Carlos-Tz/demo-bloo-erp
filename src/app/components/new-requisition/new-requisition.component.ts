import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import 'fecha';
import fechaObj from 'fecha';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { Cicle } from 'src/app/models/cicle';

@Component({
  selector: 'app-new-requisition',
  templateUrl: './new-requisition.component.html',
  styleUrls: ['./new-requisition.component.css']
})
export class NewRequisitionComponent implements OnInit {

  public myForm!: FormGroup;
  public date = '';
  //public categories: Select2Data = [];
  //public providers: Select2Data = [];
  public cicles: Cicle[] = [];

  constructor(
    private fb: FormBuilder,
    public apiR: ApiRequisitionService,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
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
    /*this.apiPv.GetProviderList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const p = item.payload.val();
        const pro = {'value': p.id, 'label': p.name};        
        this.providers.push(pro);
      });
    }); */
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

  submitSurveyData = () => {
    //this.apiP.AddProduct(this.myForm.value);
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }

}
