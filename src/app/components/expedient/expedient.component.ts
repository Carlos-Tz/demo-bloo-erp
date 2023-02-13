import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-expedient',
  templateUrl: './expedient.component.html',
  styleUrls: ['./expedient.component.css']
})
export class ExpedientComponent implements OnInit {

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
      this.myForm.patchValue({ id: data.id, name: data.name/* , crops: data.crops */ });
      data.crops.forEach(c=> {
        const pro = {'value': c, 'label': c};        
        this.crops.push(pro);
      })
    });
    this.apiC.GetCompany().valueChanges().subscribe(data => {
      this.company = data;
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
          const not = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'status': r.status, 'justification': r.justification };        
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
        if(r.customer == this.myForm.get('id').value){
          const fil = {'id': item.key, 'customer': r.customer, 'date': r.date, 'name': r.name, 'url': r.url };        
          this.files.push(fil as File);
        }   
      });
      if (this.files.length > 0) {
        this.data_files = true;
        this.dataSource2.data = this.files.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
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
      width: '80%',
      data: {
        id: id
      }
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
                [{}, { /* rowSpan: 2, */ text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n', alignment: 'center', fontSize: 12, margin: 2 }, { text: 'No. Receta: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
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
        }  
      };  
     
      pdfMake.createPdf(docDefinition).open();  
    });
  }

  PDF1(id) {
    this.apiN.GetNote(id).valueChanges().subscribe(data => {
      let prods = [];
      let subtotal = 0;
      let iva = 0;
      let total = 0;
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
              body: [
                //[{text: 'RECETA', colSpan: 5, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, {}, {}],
                //[{},{ colSpan: 4, rowSpan: 3, text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' }, {}, {}, {}, { text: 'MORELIA, MICHOACÁN', alignment: 'center'}],
                [{}, { /* rowSpan: 2, */ text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n', alignment: 'center', fontSize: 12, margin: 2, colSpan: 4 }, {}, {}, {}, { text: 'No. Pedido: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
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
                [{ text: 'DEBO (EMOS) Y PAGARÉ (MOS) INCONDICIONALMENTE POR ESTE PAGARÉ A LA ORDEN DE Cuautémoc Moreno Martínez/Milton Alejandro Rivera de León EN LA CIUDAD DE __________ EL DÍA _______ DE ________ DEL _______ LA CANTIDAD DE $ _______________ M.N.\n VALOR RECIBIDO A NUESTRA ENTERA SATISFACCIÓN POR ESTE DOCUMENTO, LA DEMORA EN EL PAGO DE ESTE PAGARÉ CAUSA INTERESES MORATORIOS A RAZÓN DEL __ % MENSUAL.', alignment: 'left', colSpan: 4, fontSize: 8, rowSpan: 3 }, {}, {}, {}, { text: 'Subtotal', alignment: 'right' }, { text: (subtotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                [{}, {}, {}, {}, { text: 'I.V.A.', alignment: 'right' }, { text: (iva).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                [{}, {}, {}, {}, { text: 'Total', alignment: 'right' }, { text: (total).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
                [{text: '____ DE ____________ DEL ________\n\n\n\n_________________________________________________\n ACEPTO (AMOS) - NOMBRE Y FIRMA', colSpan: 6, style: 'm1'}, {}, {}, {}, {}, {}]
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
          m1: {
            margin: 15,
            alignment: 'center',
            fontSize: 8
          }
        }  
      };  
     
      pdfMake.createPdf(docDefinition).open();  
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
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }
}
