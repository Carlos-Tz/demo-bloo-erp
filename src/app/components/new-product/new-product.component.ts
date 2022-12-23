import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiPresentationService } from 'src/app/services/api-presentation.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm1!: FormGroup;
  public categories: Select2Data = [];
  public presentations: Select2Data = [];
  public providers: Select2Data = [];
  public ord = 0;
  public costs: any[] = [];

  constructor(
    private fb: FormBuilder,
    public apiP: ApiProductService,
    public apiPv: ApiProviderService,
    public apiC: ApiCategoryService,
    public apiPr: ApiPresentationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.sForm();
    this.sForm1();
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
        this.providers.push(pro);
      });
    });
    this.apiP.GetLastProduct().subscribe(res=> {
      if(res[0]){
        this.ord = Number(res[0].id);
        this.myForm.patchValue({ id: this.ord + 1 });      
      } else {
        this.myForm.patchValue({ id: 1 });      
      }
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      presentation: ['', [Validators.required]],
      //brand: [''],
      //model: [''],
      unit: [''],
      //avcost: [''],
      existence: [''],
      //proration: [null],
      //class: [''],
      //type: [''],
      //rsco: [''],
      //activeingredient: [''],
      //doseacre: [''],
      //periodreentry: [''],
      //termreentry: [''],
      //safetyinterval: [''],
      //termsafetyinterval: [''],
      //toxicologicalcategory: [''],
      //blueberry: [null],
      //strawberry: [null],
      //raspberry: [null],
      //blackberry: [null],
      providers: []
    });
  }

  sForm1() {
    this.myForm1 = this.fb.group({
      key: [''],
      cost: ['',[Validators.required]],
    });
  }

  submitSurveyData = () => {
    this.apiP.AddProduct(this.myForm.value);
    this.ResetForm();
    this.toastr.success('Producto guardado!');
  }

  ResetForm() {
    this.myForm.reset();
  }

  addCost(){
    //const c = {};
    //c['cost'] = this.myForm1.get('cost')!.value;
    //this.costs.push(c);
    
    if (this.costs.find(e => e.key === this.myForm1.get('key')!.value)) {
      const c = this.costs.find(e => e.key === this.myForm1.get('key')!.value);
      c['cost'] = this.myForm1.get('cost')!.value;
      this.costs = this.costs.map(e => e.key !== this.myForm1.get('key')!.value ? e : c);
    }else {
      const c = {};
      if(this.costs.length > 0){
        let last = this.costs.pop();
        console.log(last)
      }
      c['key'] = this.costs.length + 1;
      c['cost'] = this.myForm1.get('cost')!.value;
      this.costs.push(c);
    }
    console.log(this.costs, this.costs.length);
    
    /* const c = {};
    c['cost'] = this.myForm1.get('cost')!.value;
    c['key'] = this.costs.length;
    this.costs.push(c); */
    this.myForm1.reset();
  
  }

  editCost(key: string, cost: number){
    this.myForm1.patchValue({ key: key , cost: cost})
  }

  deleteCost(key: string){
    const index = this.costs.findIndex((object) => {
      return object.key === key;
    });
    
    if (index !== -1) {
      this.costs.splice(index, 1);
    }
  }

}
