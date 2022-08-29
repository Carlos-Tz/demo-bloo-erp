import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.css']
})
export class EditProviderComponent implements OnInit {

  public myForm!: FormGroup;
  public categories: Select2Data = [];
  public cat = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.apiP.GetProvider(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.cat = data.category;
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
    this.apiP.UpdateProvider(this.myForm.value, this.data.key)
    this.toastr.success('Proveedor actualizado!');
  }

}

