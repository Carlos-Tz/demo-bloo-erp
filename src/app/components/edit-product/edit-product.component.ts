import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiPresentationService } from 'src/app/services/api-presentation.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public categories: Select2Data = [];
  public providers1: Select2Data = [];
  public presentations: Select2Data = [];
  public cat = '';
  public pre = '';
  public pro: string[] = [];
  public costs: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public apiP: ApiProductService,
    public apiPv: ApiProviderService,
    public apiC: ApiCategoryService,
    public apiPr: ApiPresentationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    //this.key = this.actRouter.snapshot.paramMap.get('key');
    this.sForm();
    this.sForm1();
    this.apiP.GetProduct(this.data.key).valueChanges().subscribe(data => {
      this.myForm.patchValue(data);
      this.cat = data.category;
      this.pro = data.providers;
      this.pre = data.presentation;
      if(data.costs){
        this.costs = data.costs;
      }
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
    this.apiPr.GetPresentationList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        //const p = item.payload.toJSON();
        const c = item.payload.val();
        const pre = {'value': c.id, 'label': c.name};        
        this.presentations.push(pre);
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
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      presentation: ['', [Validators.required]],
      unit: [''],
      existence: [''],
      providers: [],
      costs: []
    });
  }

  sForm1() {
    this.myForm1 = this.fb.group({
      id: [''],
      cost: ['',[Validators.required]],
    });
  }

  submitSurveyData = () => {
    let costs_ : any[] = [];
    this.costs.forEach((c, i) => {
      costs_.push({ id: i, cost: c.cost })
    });
    this.myForm.patchValue({ 'costs': costs_ })
    this.apiP.UpdateProduct(this.myForm.value);
    this.toastr.success('Producto actualizado!');
  }

  addCost(){
    if (this.costs.find(e => e.id === this.myForm1.get('id')!.value)) {
      const c = this.costs.find(e => e.id === this.myForm1.get('id')!.value);
      c['cost'] = this.myForm1.get('cost')!.value;
      this.costs = this.costs.map(e => e.id !== this.myForm1.get('id')!.value ? e : c);
    }else {
      const c = {};
      if(this.costs.length > 0){
        c['id'] = this.costs[this.costs.length - 1].id + 1;
      }else{
        c['id'] = 1;
      }
      c['cost'] = this.myForm1.get('cost')!.value;
      this.costs.push(c);
    }
    this.myForm1.reset();
  }

  editCost(id: string, cost: number){
    this.myForm1.patchValue({ id: id , cost: cost})
  }

  deleteCost(id: string){
    const index = this.costs.findIndex((object) => {
      return object.id === id;
    });
    
    if (index !== -1) {
      this.costs.splice(index, 1);
    }
  }
}
