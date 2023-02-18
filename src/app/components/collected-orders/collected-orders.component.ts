import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';
import { ApiCompanyService } from 'src/app/services/api-company.service';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
import { CurrencyPipe } from '@angular/common';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { ViewPaymentComponent } from '../view-payment/view-payment.component';
import { Note } from 'src/app/models/note';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { ViewChargeComponent } from '../view-charge/view-charge.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-collected-orders',
  templateUrl: './collected-orders.component.html',
  styleUrls: ['./collected-orders.component.css']
})
export class CollectedOrdersComponent implements OnInit {

  public dataSource = new MatTableDataSource<Note>();
  public data = false;
  public notes: Note[] = [];
  public company: Company;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    /* 'orderdate', */
    'paymentdate',
    /* 'provider', */
    'subtotal',
    'iva',
    'total',
    'balance',
    /* 'key_r', */
    'action',
  ];
  constructor(
    public dialog: MatDialog,
    public apiN: ApiNoteService,
    public apiC: ApiCompanyService,
    public apiP: ApiProviderService,
    public toastr: ToastrService,
    private currencyPipe:CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
      this.notes = [];
      data.forEach(item => {
        const o = item.payload.val();
        if(o.status == 5){
          this.notes.push(o as Note);
        }
      });
      if (this.notes.length > 0) {
        this.data = true;
        this.dataSource.data = this.notes.reverse().slice();
      }else{
        this.data = false;
        this.dataSource.data = [];
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    this.apiC.GetCompany().valueChanges().subscribe(data => {
      this.company = data;
    });
  }

  sortData(sort: Sort) {
    const data = this.notes.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
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

  PDF(id) {
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
                [{ image: this.company.logo, width: 50 }, { /* rowSpan: 2, */ text: this.company.name + '\n' + this.company.business_name + this.company.rfc + '\n' +  this.company.address +'\n' + this.company.email + ' / ' +this.company.tel, alignment: 'center', fontSize: 10, margin: 2, colSpan: 4 }, {}, {}, {}, { text: 'No. Pedido: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
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

  openPaymentsDialog(note: Note) {
    const dialogRef = this.dialog.open(ViewChargeComponent, {
      data: {
        note: note
      },
      autoFocus: false,
      width: '60%',
    });
  }
}

