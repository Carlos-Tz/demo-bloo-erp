import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.css']
})
export class NewProviderComponent implements OnInit {

  public myForm!: FormGroup;
  public categories: Select2Data = [];
  constructor(
    private fb: FormBuilder,
    public apiP: ApiProviderService,
    public apiC: ApiCategoryService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.apiC.GetCategoryList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const p = item.payload.val();
        const pro = {'value': p.id, 'label': p.name};        
        this.categories.push(pro);
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
      bank: [''],
      account: [''],
      clabe: ['', [Validators.minLength(18), Validators.maxLength(18)]],
      category: ['', [Validators.required]],
    });
  }

  submitSurveyData = () => {
    this.myForm.patchValue({ 'id' : (this.myForm.get('id')?.value).toUpperCase() });
    this.apiP.AddProvider(this.myForm.value);
    this.ResetForm();
  }

  ResetForm() {
    this.myForm.reset();
  }

}
