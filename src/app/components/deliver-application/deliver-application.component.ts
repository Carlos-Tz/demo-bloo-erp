import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-deliver-application',
  templateUrl: './deliver-application.component.html',
  styleUrls: ['./deliver-application.component.css']
})
export class DeliverApplicationComponent implements OnInit {
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
  @ViewChild('tbody') ttb: ElementRef<HTMLElement>;

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
            if(element1[s1].delivered || element1[s1].sector == 0){
              $('input#'+p1+'__'+s1+'__3').prop('checked', true);
              $('input#'+p1+'__'+s1+'__3').prop('disabled', true);
            }
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
    });
  }

  submitSurveyData = () => {
    let products_d = {};
    let status_a = [];
    this.products1.forEach(p => {
      let sectors_d = {};
      this.sectors1.forEach(s => {
        if(!s.startsWith('sector__')){
          let n1: string = $('input#'+p.value+'__'+s+'__1').val().toString();
          let n2: string = $('input#'+p.value+'__'+s+'__2').val().toString();
          let n3: boolean = true;
          if(!$('input#'+p.value+'__'+s+'__3').prop('checked') && !$('input#'+p.value+'__'+s+'__3').prop('disabled')){
            //console.log('active unchecked');
            n3 = false;
            status_a.push(false);
          }else if($('input#'+p.value+'__'+s+'__3').prop('disabled') && $('input#'+p.value+'__'+s+'__3').prop('checked')) {
            //console.log('inactive checked');
            n3 = true;
            status_a.push(true);
          }else{
            //console.log('active checked');
            n3 = true;
            status_a.push(true);
          }
          let nn1 = parseFloat(n1);
          let nn2 = parseFloat(n2);
          sectors_d[s] = { sector: nn1, dosis: nn2, delivered: n3 }
        }
      });
      products_d[p.value] = sectors_d
    });
    //console.log(products_d);
    if(status_a.every((e) => e)){
      this.myForm.patchValue({ 'status': 3 });
    }else {
      this.myForm.patchValue({ 'status': 2 });
    }
    this.myForm.patchValue({ 'products': products_d });
    this.apiA.UpdateApplication(this.myForm.value, this.key);
  }

  /* allSec(){
    this.sec = [];
    this.sectors.forEach(e => this.sec.push(e['value']));
  } */

  updateS(ev){
    this.sectors1 = ev.value.flatMap((e, i) => ['sector__'+e, e]);
  }

  updateP(ev){
    this.products1 = [...ev.options];
  }

  changeC(ev){
    var arrId = ev.srcElement.id.split('__');
    var sum = 0;
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2];
    this.products1.forEach(p => {
      this.sectors1.forEach(s => {
        if(!s.startsWith('sector__') && p.value == id_p && $('input#'+p.value+'__'+s+'__3').prop('checked') && !$('input#'+p.value+'__'+s+'__3').prop('disabled')){
          let n1: string = $('input#'+p.value+'__'+s+'__1').val().toString();
          //let n2: string = $('input#'+p.value+'__'+s+'__2').val().toString();
          let nn1 = parseFloat(n1);
          sum += nn1;
          $('p#'+id_p+'___p').text('Total: '+sum.toFixed(2));
          //let nn2 = parseFloat(n2);
          //sectors_d[s] = { sector: nn1, dosis: nn2 }
        }
      });
    });
  }

  all(){
    //var sum = 0;
    /* var arrId = ev.srcElement.id.split('__');
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2]; */
    
    //console.log(tb.rows)
    this.products1.forEach(p => {
      this.sectors1.forEach(s => {
        if(!s.startsWith('sector__') && !$('input#'+p.value+'__'+s+'__3').prop('checked') && !$('input#'+p.value+'__'+s+'__3').prop('disabled')){
          //$('input#'+p.value+'__'+s+'__3').prop('checked', true);
          $('input#'+p.value+'__'+s+'__3').trigger('click');



          //let n1: string = $('input#'+p.value+'__'+s+'__1').val().toString();
          //let n2: string = $('input#'+p.value+'__'+s+'__2').val().toString();
          //let nn1 = parseFloat(n1);
          //sum += nn1;
          //$('p#'+id_p+'___p').text('Total: '+sum.toFixed(2));
          //let nn2 = parseFloat(n2);
          //sectors_d[s] = { sector: nn1, dosis: nn2 }
        }
      });
    });
    /* let tb: HTMLElement = this.ttb.nativeElement
    tb.childNodes.forEach(c => {
      c.childNodes.forEach(cc => {
        //console.log(cc.firstChild);
        if(cc.childNodes[2] && cc.childNodes[2]['type'] == 'checkbox'){
          $(cc.childNodes[2]).trigger('click')
          //console.log(cc.childNodes[2])
          console.log(cc.childNodes[2]['id'])
          console.log(cc.childNodes[2]['value'])
          console.log(cc.childNodes[2]['type'])
        }
        //console.log(cc.nodeName);
      })
    }) */
  }

  /* change1(ev){
    //console.log(ev.srcElement)
    var arrId = ev.srcElement.id.split('__');
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2];
    var s = this.sectors.find((el) => { return el.label == id_s; });
    $('input#'+id_p+'__'+id_s+'__2').val((ev.srcElement.value/s.data).toFixed(2));
    this.calculate(id_p);
  }

  change2(ev){
    var arrId = ev.srcElement.id.split('__');
    var id_p = arrId[0];
    var id_s = arrId[1];
    var id_c = arrId[2];
    var s = this.sectors.find((el) => { return el.label == id_s; });
    $('input#'+id_p+'__'+id_s+'__1').val((ev.srcElement.value*s.data).toFixed(2));
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
    $('#exis').show()
    $('#existence').html(pro.data.existence);
    $('#unit').html(pro.data.unit);
    $('#unit1').html(pro.data.unit);
    $('#unit2').html(pro.data.unit);
  }

  blur1(){
    $('#exis').hide();
  } */
}
