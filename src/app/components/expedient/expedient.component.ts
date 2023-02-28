import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Select2Data } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Application } from 'src/app/models/application';
import { Company } from 'src/app/models/company';
import { ApiApplicationService } from 'src/app/services/api-application.service';
import { ApiCustomerService } from 'src/app/services/api-customer.service';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
import { ApiCompanyService } from 'src/app/services/api-company.service';
import { Note } from 'src/app/models/note';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { File } from 'src/app/models/file';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileComponent } from '../upload-file/upload-file.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ReNoteComponent } from '../re-note/re-note.component';
import { ReEditNoteComponent } from '../re-edit-note/re-edit-note.component';
import { ReEditApplicationComponent } from '../re-edit-application/re-edit-application.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  
import * as $ from 'jquery';
import 'fecha';
import fechaObj from 'fecha';
import { ChangeApplicationComponent } from '../change-application/change-application.component';
//import SignaturePad from 'signature_pad';
//import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit, AfterViewInit {

  //@ViewChild('sig1', { static: false }) signaturePad: SignaturePad;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 0.5,
    'maxWidth': 1,
    /* 'canvasWidth': 200,
    'canvasHeight': 200, */
    'penColor': "rgb(33, 33, 33)"
  };
  //signaturePad: SignaturePad;
  //@ViewChild('canvas') canvasEl: ElementRef;
  signatureImg: string;
  url='https://demo-erp.bloomingtec.mx/';
  public myForm!: FormGroup;
  public key = '';
  public crops: Select2Data = [];
  public crop = false;
  public apps = false;
  public nots = false;
  public fils = false;
  public company: Company;
  public dataSource = new MatTableDataSource<Application>();
  public dataSource1 = new MatTableDataSource<Note>();
  public dataSource2 = new MatTableDataSource<File>();
  public data = false;
  public data_files = false;
  public data_notes = false;
  public data_apps = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'date',
    /* 'customer', */
    /* 'status', */
    'justification',
    'action',
  ];
  displayedColumns2: any[] = [
    /* 'id', */
    'name',
    'date',
    /* 'url', */
    'action',
  ];
  //public categories: Select2Data = [];
  public applications: Application[] = [];
  public notes: Note[] = [];
  public files: File[] = [];
  generatedImage: string;

  constructor(
    private fb: FormBuilder,
    public apiC: ApiCompanyService,
    public apiCu: ApiCustomerService,
    public apiA: ApiApplicationService,
    public apiN: ApiNoteService,
    public apiF: FileUploadService,
    public dialog: MatDialog,
    private http: HttpClient,
    public toastr: ToastrService,
    private actRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.key = this.actRouter.snapshot.paramMap.get('id');
    this.sForm();
    this.apiCu.GetCustomer(this.key).valueChanges().subscribe(data => {
      this.myForm.patchValue({ id: data.id, name: data.name, crops: data.crops });
      data.crops.forEach(c=> {
        const pro = {'value': c, 'label': c};        
        this.crops.push(pro);
      })
    });
    this.apiC.GetCompany().valueChanges().subscribe(data => {
      this.company = data;
      //this.getBase64ImageFromUrl(this.company.logo)
      //this.getBase64ImageFromUrl('../../assets/bg.jpg')
        //.then(result => {
          //console.log(result);
          //this.generatedImage = result as string;
        //})
        //.catch(err => console.error(err));
    });
    //this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    //this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  /* async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }
 */
  ngAfterViewInit() {
    // this.signaturePad is now available
    //this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    //this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
    //this.signaturePad = new SignaturePad(this.canvasEl.nativeElement, this.signaturePadOptions);
  }

  imgChanged($event) {
    console.log($('#id_note').val());
    
    
    if ($event.target.src) {
      const imgURL = $event.target.src;
      const block = imgURL.split(';');
      const contentType = block[0].split(':')[1];
      const realData = block[1].split(',')[1];
      const blob = this.b64toBlob(realData, contentType);
      const imageFile = new File([blob], 'image.jpg', {
        type: "image/jpeg"
      });
      //this.generatedImage = window.URL.createObjectURL(imageFile);
      //window.open(this.generatedImage);

      const formData = new FormData();
      formData.append('file', imageFile);
      
      this.http.post(`${this.url}resources/upload_sign.php`, formData)
        .subscribe(async res => {
          if(res){
            console.log(res);
            const promise = new Promise((resolve, reject) => {
              this.apiN.GetNote($('#id_note').val().toString()).valueChanges().subscribe(data => {
                //this.myForm.patchValue(data);
                let current_note = data;
                resolve(current_note);
              });
            });
            await promise.then((n: Note) => {
              n['signed'] = true;
              n['url_sign'] = `${this.url}signs/${res}`;
              n['date_sign'] = fechaObj.format(new Date(), 'YYYY[-]MM[-]DD'),
              this.apiN.UpdateNote(n, n['id']);
              this.toastr.success('Pedido firmado!');

              /* this.myForm.patchValue({ date: fechaObj.format(new Date(), 'DD[/]MM[/]YYYY') });
              this.myForm.patchValue({ status: 1 });
              this.apiN.AddNote(this.myForm.value);
              this.ResetForm();
              this.toastr.success('Pedido duplicado!'); */
            });
            /* this.myForm1.patchValue({ 
              date: fechaObj.format(new Date(), 'YYYY[-]MM[-]DD'),
              name: this.myForm.get('name').value,
              url: `${this.url}files/${res}`,
              customer: this.data.id,
              crop: this.data.crop,
            }); */
            //this.apiF.AddFile(this.myForm1.value);
            //this.toastr.success('Pedido firmado!');
          }
          //alert('Uploaded Successfully.');
        })



      /* if (this.filePathf1 !== '') {
        const ref = this.storage.ref(this.filePathf1);
          ref.delete();
      }
      this.filePathf1 = `signs_sanchez/image_${Date.now()}`;
      const fileRef = this.storage.ref(this.filePathf1);
      this.storage.upload(this.filePathf1, blob).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.myForm.patchValue({firma1: url});
            this.myForm.patchValue({firma1n: this.filePathf1});
            this.toastr.success('Firma Actualizada!');
          });
        })
      ).subscribe(); */
    }
  }

  b64toBlob(b64Data, contentType, sliceSize?) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  sForm() {
    this.myForm = this.fb.group({
      id: [''],    //RFC
      name: [''],
      crops: [],
    });
  }

  updateC(ev){
    this.apps = false;
    this.nots = false;
    this.fils = false;
    if(ev.options){
      //console.log(ev.options[0].value, this.myForm.get('id').value);
      this.crop = true;
    }else{
      this.crop = false;
    }
  }

  showApps(){
    this.apps = true;
    this.nots = false;
    this.fils = false;
    this.apiA.GetApplicationList().snapshotChanges().subscribe(data => {
      this.applications = [];
      data.forEach(item => {
        const r = item.payload.val();
        if(r.customer.id == this.myForm.get('id').value && r.crops.includes(this.myForm.get('crops').value)){
          const app = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'status': r.status, 'justification': r.justification };        
          this.applications.push(app as Application);
        }   
      });
      if (this.applications.length > 0) {
        this.data_apps = true;
        this.dataSource.data = this.applications.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
  }

  showNotes(){
    this.nots = true;
    this.apps = false;
    this.fils = false;
    this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
      this.notes = [];
      data.forEach(item => {
        const r = item.payload.val();
        if(r.customer.id == this.myForm.get('id').value && r.crops.includes(this.myForm.get('crops').value)){
          const not = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'status': r.status, 'justification': r.justification, 'signed': r.signed };        
          this.notes.push(not as Note);
        }   
      });
      if (this.notes.length > 0) {
        this.data_notes = true;
        this.dataSource1.data = this.notes.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource1.paginator = this.paginator;
      }, 0);
    });
  }

  showFiles(){
    this.fils = true;
    this.nots = false;
    this.apps = false;
    this.apiF.GetFileList().snapshotChanges().subscribe(data => {
      this.files = [];
      data.forEach(item => {
        const r = item.payload.val(); 
        if(r.customer == this.myForm.get('id').value && r.crop == this.myForm.get('crops').value){
          const fil = {'id': item.key, 'customer': r.customer, 'date': r.date, 'name': r.name, 'url': r.url };        
          this.files.push(fil as File);
        }   
      });
      
      if (this.files.length > 0) {
        this.data_files = true;
        this.dataSource2.data = this.files.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
      }else{
        this.data_files = false;
        this.dataSource2.data = [];
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource2.paginator = this.paginator;
      }, 0);
    });
  }

  sortData(sort: Sort) {
    const data = this.applications.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'justification': return this.compare(a.justification.trim().toLocaleLowerCase(), b.justification.trim().toLocaleLowerCase(), isAsc);
        default: return 0;
      }
    });
  }
  sortData1(sort: Sort) {
    const data = this.notes.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource1.data = data;
      return;
    }

    this.dataSource1.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'justification': return this.compare(a.justification.trim().toLocaleLowerCase(), b.justification.trim().toLocaleLowerCase(), isAsc);
        default: return 0;
      }
    });
  }
  sortData2(sort: Sort) {
    const data = this.files.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource2.data = data;
      return;
    }

    this.dataSource2.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
        /* case 'id': return this.compare(a.id, b.id, isAsc); */
        case 'name': return this.compare(a.name.trim().toLocaleLowerCase(), b.name.trim().toLocaleLowerCase(), isAsc);
        default: return 0;
      }
    });
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public doFilter = (event: any) => {
    this.dataSource.filter = event.value.trim().toLocaleLowerCase();
  }

  public doFilter1 = (event: any) => {
    this.dataSource1.filter = event.value.trim().toLocaleLowerCase();
  }

  openUploadDialog(id: string) {
    const dialogRef = this.dialog.open(UploadFileComponent, {
      width: '100%',
      maxWidth: '98%',
      data: {
        id: id,
        crop: this.myForm.get('crops').value
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  PDF(id) {
    this.apiA.GetApplication(id).valueChanges().subscribe(data => {
      if(!data.indications){
        data.indications = [{ key: '', indication: '' }];
      }
      let docDefinition = {  
        //header: 'C# Corner PDF Header',  
        content: [
          {
            style: 'table',
            table: {
              widths: [70, 330, 'auto'],
              heights: [60, 20, 20, 20, 20, 20],
              headerRows: 1,
              body: [
                //[{text: 'RECETA', colSpan: 5, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, {}, {}],
                //[{},{ colSpan: 4, rowSpan: 3, text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' }, {}, {}, {}, { text: 'MORELIA, MICHOACÁN', alignment: 'center'}],
                [{ image: 'logo', width: 60 }, { /* rowSpan: 2, */ text: this.company.name + '\n' + this.company.business_name + this.company.rfc + '\n' +  this.company.address +'\n' + this.company.email + ' / ' +this.company.tel, alignment: 'center', fontSize: 10, margin: 2 }, { text: 'No. Receta: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
                //[{}, {}, {}, {}, {}, { text: 'Fecha: ' + data.date, alignment: 'center' }],
                [{ text: 'Nombre', fillColor: '#eeeeee' }, { text: data.customer.name, colSpan: 2 }, {}],
                [{ text: 'Domicilio', fillColor: '#eeeeee' }, { text: data.address, colSpan: 2 }, {}],
                [{ text: 'Ciudad', fillColor: '#eeeeee' }, { text: data.city, colSpan: 2 }, {}],
                [{ text: 'Justificación', fillColor: '#eeeeee' }, { text: data.justification, colSpan: 2 }, {}],
                [{ text: 'Cultivo(s)', bold: true, style: 'he', fillColor: '#eeeeee', colSpan: 3 }, {}, {}],
                ...data.crops.map(p => ([{ text: p, colSpan: 3 }, {}, {}])),
                [{ text: 'Indicaciones', bold: true, style: 'he', fillColor: '#eeeeee', colSpan: 3 }, {}, {}],
                ...data.indications.map(p => ([{ text: p.id+1 + '.- ' + p.indication, /* style: 'he', */ colSpan: 3 }, {}, {}]))
              ]
            }
          }
        ],
        styles: {
          table :{
            fontSize: 10
          },
          he: {
            margin: 5,
            alignment: 'center'
          }
        },
        images: {
          logo: this.company.logo,
        } 
      };  
     
      pdfMake.createPdf(docDefinition).open();  
    });
  }

  PDF1(id) {
    this.apiN.GetNote(id).valueChanges().subscribe(async data => {
      let prods = [];
      let subtotal = 0;
      let iva = 0;
      let total = 0;
      let sign = '';
      if(!data.products){
        prods = [{ id: '', name: '', cost: '', iva: '', presentation: '', quantity: '', unit: '' }];        
        //let prods: any = Object.values(data.products);
      }else {
        prods = Object.values(data.products);
      }
      prods.map(p => {
        subtotal += p.quantity*p.cost;
        if(p.iva){
          iva += (p.quantity*p.cost)*0.16;
        }
      });
      total = subtotal + iva;
      /* const promise1 = new Promise((resolve, reject) => { */
        if(data.url_sign){
          //this.getBase64ImageFromUrl(data.url_sign)
          //this.getBase64ImageFromUrl('../../assets/bg.jpg')
          //.then(result => {
            //testImage.src = result
            //console.log(result);
            //sign = result as string;
            sign = data.url_sign;
            //resolve(sign);
          //})
          //.catch(err => console.error(err));
        }else {
          sign = 'data:image/png;base64,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';
          //resolve(sign);
        }
      //});
      /* await promise1.then((s: string) => { */
        let docDefinition = {  
          //header: 'C# Corner PDF Header',  
          content: [
            {
              style: 'table',
              table: {
                //widths: [60, 340, 'auto'],
                widths: [60, 50, 60, 165, 55, 'auto'],
                heights: [60, 20, 20, 20, 20],
                headerRows: 1,
                hLineColor: '#f00',
                body: [
                  //[{text: 'RECETA', colSpan: 5, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, {}, {}],
                  //[{},{ colSpan: 4, rowSpan: 3, text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' }, {}, {}, {}, { text: 'MORELIA, MICHOACÁN', alignment: 'center'}],
                  [{ image: this.generatedImage/* this.company.logo */, width: 50 }, { /* rowSpan: 2, */ text: this.company.name + '\n' + this.company.business_name + this.company.rfc + '\n' +  this.company.address +'\n' + this.company.email + ' / ' +this.company.tel, alignment: 'center', fontSize: 10, margin: 2, colSpan: 4 }, {}, {}, {}, { text: 'No. Pedido: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
                  //[{}, {}, {}, {}, {}, { text: 'Fecha: ' + data.date, alignment: 'center' }],
                  [{ text: 'Nombre', fillColor: '#eeeeee' }, { text: data.customer.name, colSpan: 5 }, {}, {}, {}, {}],
                  [{ text: 'Domicilio', fillColor: '#eeeeee' }, { text: data.address, colSpan: 5 }, {}, {}, {}, {}],
                  [{ text: 'Ciudad', fillColor: '#eeeeee' }, { text: data.city, colSpan: 5 }, {}, {}, {}, {}],
                  [{ text: 'Justificación', fillColor: '#eeeeee' }, { text: data.justification, colSpan: 5 }, {}, {}, {}, {}],
                  [{ text: 'Cultivo(s)', bold: true, style: 'ce', fillColor: '#eeeeee', colSpan: 6 }, {}, {}, {}, {}, {}],
                  ...data.crops.map(p => ([{ text: p, colSpan: 6 }, {}, {}, {}, {}, {}])),
                  [{ text: 'Cantidad', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Unidad', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Presentación', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Descripción', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'P.U.', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Importe', bold: true, style: 'ce', fillColor: '#eeeeee' }],
                  //...data.products.map(p => ([{ text: p.id + '.- ' + p.name, /* style: 'he', */ colSpan: 3 }, {}, {}]))
                  ...prods.map(p => ([{ text: p.quantity, style: 'ce' }, { text: p.unit, style: 'ce' }, { text: p.presentation, style: 'ce' }, { text: p.name, style: 'ce' }, { text: (p.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }, { text: (p.cost*p.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }])),
                  [{ text: '', colSpan: 4, fontSize: 8, rowSpan: 3 }, {}, {}, {}, { text: 'Subtotal', alignment: 'right' }, { text: (subtotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                  [{}, {}, {}, {}, { text: 'I.V.A.', alignment: 'right' }, { text: (iva).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                  [{}, {}, {}, {}, { text: 'Total', alignment: 'right' }, { text: (total).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                  [{text: 'DEBO (EMOS) Y PAGARÉ (MOS) INCONDICIONALMENTE POR ESTE PAGARÉ A LA ORDEN DE Cuautémoc Moreno Martínez/Milton Alejandro Rivera de León EN LA CIUDAD DE __________ EL DÍA _______ DE ________ DEL _______ LA CANTIDAD DE $ _______________ M.N. VALOR RECIBIDO A NUESTRA ENTERA SATISFACCIÓN POR ESTE DOCUMENTO, LA DEMORA EN EL PAGO DE ESTE PAGARÉ CAUSA INTERESES MORATORIOS A RAZÓN DEL __ % MENSUAL.', alignment: 'left', fontSize: 7, colSpan: 6 }, {}, {}, {}, {}, {}],
                  [{text: data.date_sign ? '\nFirmado: ' + data.date_sign : '\n____ DE ____________ DEL ________', colSpan: 6, style: 'ce1'}, {}, {}, {}, {}, {}],
                  [{ image: 'sign_1', width: 100, colSpan: 6, alignment: 'center' }, {}, {}, {}, {}, {}],
                  [{text: 'ACEPTO (AMOS) - NOMBRE Y FIRMA', colSpan: 6, style: 'ce1'}, {}, {}, {}, {}, {}],
                ]
              },
            }
          ],
          styles: {
            table :{
              fontSize: 10
            },
            he: {
              margin: 5,
              alignment: 'center'
            },
            ce: {
              alignment: 'center'
            },
            ce1: {
              alignment: 'center',
              fontSize: 8
            },
            m1: {
              margin: 15,
              alignment: 'center',
              fontSize: 8
            }
          },
          images: {
            logo: this.company.logo,
            sign_1: sign
          } 
        };  
       
        pdfMake.createPdf(docDefinition).open();  
      /* }); */
      
    });
  }

  openDeleteDialog(id: string, url: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este documento?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const formData = new FormData();
        //formData.append('id', id);
        formData.append('url', url);
          
        this.http.post(`${this.url}resources/delete_file.php`, formData)
          .subscribe(res => {
            if(res){
              //console.log(res);
              this.apiF.DeleteFile(id) ;
              this.toastr.info('Documento eliminado!');
              //console.log(this.dataSource2.data);
              
              if (this.dataSource2.data.length == 1){
                this.data_files = false;
              }
            }else{
              this.toastr.warning('No se pudo eliminar el documento!')
            }
            //alert('Uploaded Successfully.');
          });
      }
    });
  }

  openRenoteDialog(id: string) {
    const dialogRef = this.dialog.open(ReNoteComponent, {
      data: {
        id: id
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }

  openEditDialog(id: string) {
    const dialogRef = this.dialog.open(ReEditNoteComponent, {
      data: {
        id: id
      },
      width: '100%',
      maxWidth: '98%',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }

  openEditAppDialog(id: string) {
    const dialogRef = this.dialog.open(ReEditApplicationComponent, {
      data: {
        id: id
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }

  openChangeAppDialog(id: string) {
    const dialogRef = this.dialog.open(ChangeApplicationComponent, {
      data: {
        id: id
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }
}
