import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { ApiCustomerService } from 'src/app/services/api-customer.service';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit {

  public myForm!: FormGroup;
  public key = '';
  public crops: Select2Data = [];

  constructor(
    private fb: FormBuilder,
    public apiCu: ApiCustomerService,
    public toastr: ToastrService,
    private actRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.key = this.actRouter.snapshot.paramMap.get('id');
    this.sForm();
    this.apiCu.GetCustomer(this.key).valueChanges().subscribe(data => {
      this.myForm.patchValue({ id: data.id, name: data.name/* , crops: data.crops */ });
      data.crops.forEach(c=> {
        const pro = {'value': c, 'label': c};        
        this.crops.push(pro);
      })
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [''],    //RFC
      name: [''],
      crops: [],
    });
  }

  updateC(ev){
    if(ev.options){
      console.log(ev.options);
    }
    
  }
}
