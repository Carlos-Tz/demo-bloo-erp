import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit, OnDestroy {

  public myForm!: FormGroup;
  public categories: Select2Data = [];
  public providers1: Select2Data = [];
  public cat = '';
  public pro: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiP: ApiProductService,
    public apiPv: ApiProviderService,
    public apiC: ApiCategoryService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    //this.key = this.actRouter.snapshot.paramMap.get('key');
    this.sForm();
    this.apiP.GetProduct(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.cat = data.category;
      this.pro = data.providers;
      //this.pro = ["1454sas42121", "dsd098juhju4"];
      //this.myForm.patchValue({ providers: this.pro });
      //console.log(this.myForm.value);
      //console.log(data);
      
      //this.myForm.patchValue({ providers: this.pro });
      //this.pro = data.providers;
      //console.log(data.providers);
      
    });

    this.apiC.GetCategoryList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const c = item.payload.val();
        const cat = {'value': c.id, 'label': c.name};        
        this.categories.push(cat);
      });
    });
    this.apiPv.GetProviderList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const p = item.payload.val();
        const pro = {'value': p.id, 'label': p.name};        
        this.providers1.push(pro);
      });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      //id: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(12)]],    //RFC
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      brand: [''],
      model: [''],
      unit: [''],
      avcost: [''],
      existence: [''],
      proration: [null],
      providers: []
    });
  }

  submitSurveyData = () => {
    this.apiP.UpdateProduct(this.myForm.value, this.data.key);
    this.toastr.success('Producto actualizado!');
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    //this.dtTrigger.unsubscribe();
    //$.fn['dataTable'].ext.search.pop();
  }
}
