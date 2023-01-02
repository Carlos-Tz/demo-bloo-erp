import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCropService } from 'src/app/services/api-crop.service';
import { ApiCustomerService } from 'src/app/services/api-customer.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit {

  public myForm!: FormGroup;
  public crops: Select2Data = [];
  constructor(
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
        const pro = {'value': p.id, 'label': p.name};        
        this.crops.push(pro);
      });
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
    this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    this.apiCu.AddCustomer(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Cliente guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

}
