import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCropService } from 'src/app/services/api-crop.service';
import { ApiCustomerService } from 'src/app/services/api-customer.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {

  public myForm!: FormGroup;
  public crops: Select2Data = [];
  public cro: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiCu: ApiCustomerService,
    public apiC: ApiCropService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiC.GetCropList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const p = item.payload.val();
        const cro = {'value': p.id, 'label': p.name};        
        this.crops.push(cro);
      });
    });
    this.apiCu.GetCustomer(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.cro = data.crops;
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(12)]],    //RFC
      name: ['', [Validators.required]],
      phone: [''],
      contact: [''],
      street: [''],
      num: [''],
      colony: [''],
      pc: ['', [Validators.maxLength(5), Validators.min(10000), Validators.max(99999)]],
      city: [''],
      state: [''],
      cellphone: [''],
      email: ['', Validators.email],
      crops: [],
    });
  }

  submitSurveyData = () => {
    this.apiCu.UpdateCustomer(this.myForm.value, this.data.key)
    this.toastr.success('Cliente actualizado!');
  }

}

