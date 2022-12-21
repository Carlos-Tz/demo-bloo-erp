import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Ranch } from 'src/app/models/ranch';
import { ApiApplicationService } from 'src/app/services/api-application.service';
import { ApiProductService } from 'src/app/services/api-product.service';
import { ApiRanchService } from 'src/app/services/api-ranch.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-run-application',
  templateUrl: './run-application.component.html',
  styleUrls: ['./run-application.component.css']
})
export class RunApplicationComponent implements OnInit {
  public myForm!: FormGroup;
  public key = '';
  public pro: string[] = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  public sectors1: any[] = [];
  public sectors2: any[] = [];
  public sec: string[] = [];
  public prod: string[] = [];
  public sectors: Select2Data = [];
  public ranches: Ranch[] = [];
  public tab = false;
  public scheduled = 0;

  constructor(
    private fb: FormBuilder,
    public apiRa: ApiRanchService,
    public apiA: ApiApplicationService,
    public apiP: ApiProductService,
    public toastr: ToastrService,
    private actRouter: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this.key = this.actRouter.snapshot.paramMap.get('id');
    this.sForm();
    this.apiP.GetProductList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const p = item.payload.val();
        if((p.category == 'FERTILIZANTES' || p.category == 'AGROQUIMICOS') && p.existence >= 0.01){
          const pro = {'value': item.key!, 'label': p.name, 'data': { 'existence': p.existence, 'unit': p.unit }};
          this.products.push(pro);
        }
      });
    });
    const promise = new Promise((resolve, reject) => {
      this.apiA.GetApplication(this.key).valueChanges().subscribe(data => {
        this.myForm.patchValue(data);        
        if(data.id_ranch){
          this.sectors = [];
          this.apiRa.GetRanch(data.id_ranch).valueChanges().subscribe(data1 => {
            if(data1.sectors){
              for (const e in data1.sectors) {
                if (Object.prototype.hasOwnProperty.call(data1.sectors, e)) {
                  const element = data1.sectors[e];
                  const sec = {'value': element.id, 'label': element.name, 'data': element.hectares};   
                  this.sectors.push(sec);
                }
              }
            }
            resolve(data.products);
          });
        }
      });
    });

    await promise.then((p_l: any) => {
      //const promise1 = new Promise((resolve, reject) => {
        if(p_l){
          let ind = 0;
          this.prod = [];
          this.sec = [];
          for (const p in p_l) {
            this.prod.push(p);
            if (Object.prototype.hasOwnProperty.call(p_l, p)) {
              const element = p_l[p];
              for (const s in element){
                if(ind == 0){
                  this.sec.push(s)
                }
              }
            }
            ind++;
          }
          //resolve(p_l);
        }
    });

  }

  table(){
    this.apiA.GetApplication(this.key).valueChanges().subscribe(data => {
      for (const p1 in data.products) {
        if (Object.prototype.hasOwnProperty.call(data.products, p1)) {
          const element1 = data.products[p1];
          for (const s1 in element1){
            $('input#'+p1+'__'+s1+'__1').val((element1[s1].sector).toFixed(2));
            $('input#'+p1+'__'+s1+'__2').val((element1[s1].dosis).toFixed(2));
          }
        }
      }
    });
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [null, [Validators.required]],
      date: ['', [Validators.required]],
      id_ranch: ['', [Validators.required]],
      status: [''],
      justification: ['', [Validators.required]],
      manager: ['', [Validators.required]],
      equipment: ['', [Validators.required]],
      products: [],
      sectors: [],
    });
  }

  submitSurveyData = () => {
    let sectors_d = {};
    this.sectors2.forEach(s => {
      let date: string = $('input#'+s+'___date').val().toString();
      let initial: string = $('input#'+s+'___initial').val().toString();
      let final: string = $('input#'+s+'___final').val().toString();
      let minutes: number = parseFloat($('input#'+s+'___minutes').val().toString());
      sectors_d[s] = { sector: s, date: date, initial: initial, final: final, minutes: minutes };
    });
    this.myForm.patchValue({ 'sectors': sectors_d });
    this.myForm.patchValue({ 'status': 4 });
    this.apiA.UpdateApplication(this.myForm.value, this.key);
  }

  allSec(){
    this.sec = [];
    this.sectors.forEach(e => this.sec.push(e['value']));
  }

  updateS(ev){
    this.sectors1 = ev.value.flatMap((e, i) => ['sector__'+e, e]);
    this.sectors2 = ev.value.flatMap((e, i) => [e]);
  }

  updateP(ev){
    this.products1 = [...ev.options];
  }

  change1(ev){
    //console.log(ev.srcElement)
    var arrId = ev.srcElement.id.split('__');
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2];
    var s = this.sectors.find((el) => { return el.label == id_s; });
    
    if(parseFloat(ev.srcElement.value) <= parseFloat($('#available').val().toString())){
      $('input#'+id_p+'__'+id_s+'__2').val((parseFloat(ev.srcElement.value)/s.data).toFixed(2)); console.log('ok');
      
    }else {
      $('input#'+id_p+'__'+id_s+'__1').val(0);
      $('input#'+id_p+'__'+id_s+'__2').val(0);
    }
    this.calculate(id_p);
  }

  change2(ev){
    var arrId = ev.srcElement.id.split('__');
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2];
    var s = this.sectors.find((el) => { return el.label == id_s; });
    //$('input#'+id_p+'__'+id_s+'__1').val((parseFloat(ev.srcElement.value)*s.data).toFixed(2));
    if(parseFloat(ev.srcElement.value)*s.data <= parseFloat($('#available').val().toString())){
      $('input#'+id_p+'__'+id_s+'__1').val((parseFloat(ev.srcElement.value)*s.data).toFixed(2));
    }else {
      $('input#'+id_p+'__'+id_s+'__1').val(0);
      $('input#'+id_p+'__'+id_s+'__2').val(0);
    }
    this.calculate(id_p);
  }

  calculate(id_p){
    let sum = 0;
    this.sectors1.forEach(p => {
      if(!p.startsWith('sector__')){
        let n: string = $('input#'+id_p+'__'+p+'__1').val().toString();
        sum += parseFloat(n);
      }
    });
    //console.log(sum);
  }

  changeD(ev){
    this.sectors2.forEach(s => {
      $('input#'+s+'___date').val(ev.srcElement.value);
    });
  }

  changeI(ev){
    this.sectors2.forEach(s => {
      $('input#'+s+'___initial').val(ev.srcElement.value);
    });
  }

  changeF(ev){
    this.sectors2.forEach(s => {
      $('input#'+s+'___final').val(ev.srcElement.value);
    });
  }

  changeM(ev){
    this.sectors2.forEach(s => {
      $('input#'+s+'___minutes').val(ev.srcElement.value);
    });
  }

}
