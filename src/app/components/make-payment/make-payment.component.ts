import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Payment } from 'src/app/models/payment';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']
})
export class MakePaymentComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm2!: FormGroup;
  public provider: string;
  public paymentdate: string;
  public balance: number;
  public payments: Payment[];

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
    this.myForm2.patchValue(this.data.order);
    this.paymentdate = this.data.order.paymentdate;
    this.balance = this.data.order.balance;
    if(this.data.order.payments){
      this.payments = this.data.order.payments;
    }else{
      this.payments = [];
    }
    this.myForm.patchValue({ 'amount': this.balance });
    this.apiP.GetProvider(this.data.order.provider).valueChanges().subscribe(data => {
      this.provider = data.name;
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      date: ['', Validators.required],
      paymenttype: ['', Validators.required],
      document: [''],
      folio: [''],
      amount: [null, Validators.required],
    });
    this.myForm2 = this.fb.group({
      avcost: [null, [Validators.required]],
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
      folio: [''],
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
    this.myForm2.reset();
  }

  paidout(){
    this.payments.push(this.myForm.value as Payment);
    let amount = this.myForm.get('amount').value;
    if(amount == this.balance){
      this.myForm2.patchValue({ 'status': 4 });
    }else {
      this.myForm2.patchValue({ 'status': 3 });
    }
    let paid = this.myForm2.get('paidout').value;
    this.myForm2.patchValue({ 'paidout': paid + amount });
    this.myForm2.patchValue({ 'payments': this.payments });
    this.myForm2.patchValue({ 'balance': this.balance - amount });
    this.apiO.UpdateOrder(this.myForm2.value, this.data.order.id);
    this.ResetForm();
    this.toastr.success('Pago registrado!');
  }
}
