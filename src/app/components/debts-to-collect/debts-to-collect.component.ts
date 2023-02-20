import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Provider } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Note } from 'src/app/models/note';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';

@Component({
  selector: 'app-debts-to-collect',
  templateUrl: './debts-to-collect.component.html',
  styleUrls: ['./debts-to-collect.component.css']
})
export class DebtsToCollectComponent implements OnInit {

  public myForm!: FormGroup;
  //public providers: Provider[];
  public notes: Note[];
  constructor(
    private fb: FormBuilder,
    //public apiP: ApiProviderService,
    public apiN: ApiNoteService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.sForm();
    /* this.apiP.GetProviderList().snapshotChanges().subscribe(data => {
      this.providers = [];
      data.forEach(item => {
        const o = item.payload.val();
        this.providers.push(o as Provider);
      });
      this.myForm.patchValue({ 'providers': this.providers });
    }); */
    this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
      this.notes = [];
      data.forEach(item => {
        const n = item.payload.val();
        if(n.status > 1){
          this.notes.push(n as Note);
        }
      });
      this.myForm.patchValue({ 'notes': this.notes });
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      initial_date: ['', [Validators.required]],
      final_date: ['', [Validators.required]],
      notes: [],
      //providers: [],
    }, {validator: this.dateLessThan('initial_date', 'final_date')});
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
     let f = group.controls[from];
     let t = group.controls[to];
     if (f.value > t.value) {
       return {
         dates: "La fecha inicial debe ser menor a la fecha final!."
       };
     }
     return {};
    }
  }

  submitSurveyData() {
    //let url='http://localhost:8080/local/dev/adm/php-back/';
    let url='https://demo-erp.bloomingtec.mx/resources/';
    let n_notes: any[] = this.notes.filter((e) => {
      return e.paymentdate >= this.myForm.get('initial_date').value && e.paymentdate <= this.myForm.get('final_date').value
    });
    /* let nn_orders: any[] = [];
    n_orders.forEach(o => {
      const p = this.providers.filter((pro) => {
          return pro['id'] == o.provider;
      });
      let n_o = o;
      n_o['provider_name'] = p[0]['name'];
      nn_orders.push(n_o);
    }); */
    this.myForm.patchValue({ 'notes': n_notes });
    console.log(n_notes);
    
    this.apiN.excel(n_notes, url).subscribe(res => {
      //console.log(res);
      window.location.href = `${url}cuentasXcobrar.xlsx`;
    }, err => {
      console.log(err);
    });
    
  }

  ResetForm() {
    this.myForm.reset();
  }

}
