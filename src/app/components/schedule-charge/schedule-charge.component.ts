import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-schedule-charge',
  templateUrl: './schedule-charge.component.html',
  styleUrls: ['./schedule-charge.component.css']
})
export class ScheduleChargeComponent implements OnInit {

  public myForm!: FormGroup;
  public customer: string;

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
    this.myForm.patchValue(this.data.note);
    this.myForm.patchValue({ 'status': 3 });
    this.customer = this.data.note.customer.name;
    /* this.apiP.GetProvider(this.data.order.provider).valueChanges().subscribe(data => {
    }); */
    console.log(this.data.note, this.myForm.value);
    
  }

  sForm() {
    this.myForm = this.fb.group({
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
      complete: ['', [Validators.required]],
      paymentdate: ['', [Validators.required]],
      folio: [null],
      paymenttype: ['', [Validators.required]],
      orderdate: [''],
      crops: [],
      products: [],
      balance: [null, [Validators.required]],
      paidout: [null, [Validators.required]],
      payments: [],
    });
  }


  ResetForm() {
    this.myForm.reset();
  }

  schedule(){
    this.apiN.UpdateNote(this.myForm.value, this.data.note.id);
    this.ResetForm();
    this.toastr.success('Cobro programado!');
  }
}
