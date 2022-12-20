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
import 'fecha';
import fechaObj from 'fecha';

@Component({
  selector: 'app-redeliver-application',
  templateUrl: './redeliver-application.component.html',
  styleUrls: ['./redeliver-application.component.css']
})
export class RedeliverApplicationComponent implements OnInit {
  public myForm!: FormGroup;
  public key = '';
  public pro: string[] = [];
  public products: Select2Data = [];
  public products1: any[] = [];
  public sectors1: any[] = [];
  public sec: string[] = [];
  public prod: string[] = [];
  public sectors: Select2Data = [];
  public ranches: Ranch[] = [];
  public tab = false;
  public scheduled = 0;
  public ord = 0;
  public date = '';


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
        this.date = fechaObj.format(new Date(), 'DD[/]MM[/]YYYY');
        this.myForm.patchValue({ date: this.date });  
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

  async table(){
    const promise6 = new Promise((resolve, reject) => {
      this.apiA.GetApplicationList().snapshotChanges().subscribe(datal => {
        //resolve(datal);
        const appl = [];
        datal.forEach(item => {
          const r = item.payload.val();     
          if(r.status < 3 && r.id != this.key){
            if(r.products){
              appl.push(r);
            }
          }  
        });
        resolve(appl);
      });
    });
    await promise6.then((appll: any[]) => {
      this.apiA.GetApplication(this.key).valueChanges().subscribe(data => {
        for (const p1 in data.products) {
          if (Object.prototype.hasOwnProperty.call(data.products, p1)) {
            let schedu = 0;
            const element1 = data.products[p1];
            for (const s1 in element1){
              $('input#'+p1+'__'+s1+'__1').val((element1[s1].sector).toFixed(2));
              $('input#'+p1+'__'+s1+'__2').val((element1[s1].dosis).toFixed(2));
              let n1: string = $('input#'+p1+'__'+s1+'__1').val().toString();
              let nn1 = parseFloat(n1);
              schedu += nn1;
            }
            //console.log(schedu);
            let sch = 0;
            appll.forEach(a => {
              if(a.products){
                Object.entries(a.products).forEach(([key, value], index) => {
                  if(key == p1){
                    Object.entries(value).forEach(([k,v], i) => {
                      if(!v.delivered){
                        //console.log(p1, v.sector);
                        sch += v.sector;
                      }
                    });                        
                  }
                }); 
              }
            });

            let csc = this.products1.filter(pp => { return pp.value == p1 });
            if(csc[0].data.existence < sch + schedu){
              for (const s2 in element1){
                $('input#'+p1+'__'+s2+'__1').val(0);
                $('input#'+p1+'__'+s2+'__2').val(0);
              }
            }
          }
        }
      });
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
    });
  }

  submitSurveyData = async () => {
    let products_d = {};
    this.products1.forEach(p => {
      let sectors_d = {};
      this.sectors1.forEach(s => {
        if(!s.startsWith('sector__')){
          let n1: string = $('input#'+p.value+'__'+s+'__1').val().toString();
          let n2: string = $('input#'+p.value+'__'+s+'__2').val().toString();
          let nn1 = parseFloat(n1);
          let nn2 = parseFloat(n2);
          sectors_d[s] = { sector: nn1, dosis: nn2, delivered: false }
        }
      });
      products_d[p.value] = sectors_d
    });
    this.myForm.patchValue({ 'products': products_d });
    this.myForm.patchValue({ 'status': 1 });
    //this.apiA.UpdateApplication(this.myForm.value, this.key)
    const promise7 = new Promise((resolve, reject) => {
      this.apiA.GetLastApplication().subscribe(res=> {
        if(res[0]){
          this.ord = Number(res[0].id);
          this.myForm.patchValue({ id: this.ord + 1 });      
        } else {
          this.myForm.patchValue({ id: 1 });      
        }
        resolve(this.myForm.value)
      });
      
    });
    await promise7.then((form: any) => {
      this.apiA.AddApplication(form);
    });
  }

  allSec(){
    this.sec = [];
    this.sectors.forEach(e => this.sec.push(e['value']));
  }

  updateS(ev){
    this.sectors1 = ev.value.flatMap((e, i) => ['sector__'+e, e]);
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
    //$('input#'+id_p+'__'+id_s+'__2').val((ev.srcElement.value/s.data).toFixed(2));
    console.log(parseFloat($('#available').val().toString()));
    console.log(parseFloat(ev.srcElement.value));
    
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

  focus1(pro){
    //console.log(pro);
    this.scheduled = 0;
    this.sectors1.forEach(s => {
      if(!s.startsWith('sector__')){
        let n1: string = $('input#'+pro.value+'__'+s+'__1').val().toString();
        let nn1 = parseFloat(n1);
        this.scheduled += nn1;
      }
    });
    this.apiA.GetApplicationList().snapshotChanges().subscribe(data => {
      data.forEach(item => {
        const r = item.payload.val();     
        if(r.status < 3 && r.id != this.key){
          if(r.products){
            Object.entries(r.products).forEach(([key, value], index) => {
              if(key == pro.value){
                Object.entries(value).forEach(([k,v], i) => {
                  if(!v.delivered){
                    //console.log(v);
                    this.scheduled += v.sector;
                  }
                });
              }
              
            });
          }
        }   
      });
      $('#scheduled').val(this.scheduled.toFixed(2));
      $('#available').val((pro.data.existence - this.scheduled).toFixed(2));
      //$('#scheduled').val(scheduled.toFixed(2));
    });
    $('#exis').show()
    $('#existence').val(pro.data.existence.toFixed(2));
    //$('#available').val((pro.data.existence - parseFloat($('#scheduled').val().toString())).toFixed(2));
    //$('#existence').html(pro.data.existence);
    $('#unit').html(pro.data.unit);
    $('#unit1').html(pro.data.unit);
    $('#unit2').html(pro.data.unit);
  }

  blur1(){
    $('#exis').hide();
  }
}
