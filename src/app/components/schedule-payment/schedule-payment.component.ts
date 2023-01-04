import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-schedule-payment',
  templateUrl: './schedule-payment.component.html',
  styleUrls: ['./schedule-payment.component.css']
})
export class SchedulePaymentComponent implements OnInit {

  public myForm!: FormGroup;
  public provider: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public apiP: ApiProviderService,
    public apiO: ApiOrdersService
  ) { }

  ngOnInit(): void {
    this.provider = '';
    this.sForm();
    this.myForm.patchValue(this.data.order);
    this.myForm.patchValue({ 'status': 2 });
    this.apiP.GetProvider(this.data.order.provider).valueChanges().subscribe(data => {
      this.provider = data.name;
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      //avcost: [null, [Validators.required]],
      id: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      key: ['', [Validators.required]],
      key_r: ['', [Validators.required]],
      name: ['', [Validators.required]],
      orderdate: ['', [Validators.required]],
      price: [null, [Validators.required]],
      provider: ['', [Validators.required]],
      quantity: [null, [Validators.required]],
      unit: ['', [Validators.required]],
      folio: [null],
      paymentdate: ['', [Validators.required]],
      paymenttype: ['', [Validators.required]],
      status: ['', [Validators.required]],
      balance: [null, Validators.required],
      paidout: [null, Validators.required],
      payments: [],
    });
  }


  ResetForm() {
    this.myForm.reset();
  }

  schedule(){
    this.apiO.UpdateOrder(this.myForm.value, this.data.order.id);
    this.ResetForm();
    this.toastr.success('Pago programado!');
  }
}
