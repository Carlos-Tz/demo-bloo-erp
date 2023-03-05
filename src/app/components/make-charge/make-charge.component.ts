import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Payment } from 'src/app/models/payment';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-make-charge',
  templateUrl: './make-charge.component.html',
  styleUrls: ['./make-charge.component.css']
})
export class MakeChargeComponent implements OnInit {

  public myForm!: FormGroup;
  public myForm2!: FormGroup;
  public customer: string;
  public paymentdate: string;
  public balance: number;
  public payments: Payment[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public apiP: ApiProviderService,
    public apiN: ApiNoteService
  ) { }

  ngOnInit(): void {
    this.customer = '';
    this.sForm();
    this.myForm2.patchValue(this.data.note); //console.log(this.data.note, this.myForm2.value);
    
    this.paymentdate = this.data.note.paymentdate;
    this.balance = this.data.note.balance;
    if(this.data.note.payments){
      this.payments = this.data.note.payments;
    }else{
      this.payments = [];
    }
    this.myForm.patchValue({ 'amount': this.balance });
    this.customer = this.data.note.customer.name;
    /* this.apiP.GetProvider(this.data.order.provider).valueChanges().subscribe(data => {
      this.provider = data.name;
    }); */
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
      id: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      subtotal: [null, [Validators.required]],
      total: [null, [Validators.required]],
      date: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      status: ['', [Validators.required]],
      justification: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      send: ['', [Validators.required]],
      signed: [''],
      complete: ['', [Validators.required]],
      paymentdate: ['', [Validators.required]],
      folio: [null],
      paymenttype: ['', [Validators.required]],
      orderdate: [''],
      url_sign: [''],
      date_sign: [''],
      name_sign: [''],
      user: [''],
      crops: [],
      products: [],
      balance: [null, [Validators.required]],
      paidout: [null, [Validators.required]],
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
      this.myForm2.patchValue({ 'status': 6 });
    }else {
      this.myForm2.patchValue({ 'status': 5 });
    }
    let paid = this.myForm2.get('paidout').value;
    this.myForm2.patchValue({ 'paidout': paid + amount });
    this.myForm2.patchValue({ 'payments': this.payments });
    this.myForm2.patchValue({ 'balance': this.balance - amount });
    this.apiN.UpdateNote(this.myForm2.value, this.data.note.id);
    //console.log(this.myForm2.value);
    this.ResetForm();
    
    this.toastr.success('Cobro registrado!');
  }
}
