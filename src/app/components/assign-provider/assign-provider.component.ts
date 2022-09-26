import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';

@Component({
  selector: 'app-assign-provider',
  templateUrl: './assign-provider.component.html',
  styleUrls: ['./assign-provider.component.css']
})
export class AssignProviderComponent implements OnInit {

  public myForm!: FormGroup;
  public providers: Select2Data = [];
  public pro: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiPr: ApiProviderService,
    public apiP: ApiProductService,
    public apiR: ApiRequisitionService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiP.GetProduct(this.data.pro.key).valueChanges().subscribe(data => {
      this.pro = data.providers;
      this.pro.forEach(e => {
        this.apiPr.GetProvider(e).valueChanges().subscribe(dat => {
          const pro = {'value': dat.id, 'label': dat.name};        
          this.providers.push(pro);
        });
      });
    });
    this.myForm.patchValue(this.data.pro);
  }

  sForm() {
    this.myForm = this.fb.group({
      provider: ['', [Validators.required]],
      price: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      avcost: [null, [Validators.required]],
      key: ['', [Validators.required]],
      name: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      unit: ['', [Validators.required]],
    });
  }

  submitSurveyData = () => {
    //this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    //this.apiPr.AddProvider(this.myForm.value);
    this.apiR.AssignProvider(this.data.id_r, this.myForm.value, this.data.id)
    this.ResetForm();
    this.toastr.success('Proveedor guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}

