import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';
import { Order } from 'src/app/models/order';
import { ApiCompanyService } from 'src/app/services/api-company.service';
import { ApiOrdersService } from 'src/app/services/api-orders.service';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
import { CurrencyPipe } from '@angular/common';
import { SchedulePaymentComponent } from '../schedule-payment/schedule-payment.component';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { MakePaymentComponent } from '../make-payment/make-payment.component';
import { ViewPaymentComponent } from '../view-payment/view-payment.component';
import { PaidOrdersComponent } from '../paid-orders/paid-orders.component';
import { NewOrderComponent } from '../new-order/new-order.component';
import { DebtsToPayComponent } from '../debts-to-pay/debts-to-pay.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  public dataSource = new MatTableDataSource<Order>();
  public data = false;
  public orders: Order[] = [];
  public company: Company;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'status',
    /* 'orderdate', */
    'paymentdate',
    /* 'provider', */
    'price',
    'iva',
    'quantity',
    'balance',
    /* 'key_r', */
    'action',
  ];
  constructor(
    public dialog: MatDialog,
    public apiO: ApiOrdersService,
    public apiC: ApiCompanyService,
    public apiP: ApiProviderService,
    public toastr: ToastrService,
    private currencyPipe:CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.apiO.GetOrdersList().snapshotChanges().subscribe(data => {
      this.orders = [];
      data.forEach(item => {
        const o = item.payload.val();
        if(o.status != 4){
          this.orders.push(o as Order);
        }
      });
      if (this.orders.length > 0) {
        this.data = true;
        this.dataSource.data = this.orders.reverse().slice();
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
    const data = this.orders.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'orderdate': return this.compare(a.orderdate.trim().toLocaleLowerCase(), b.orderdate.trim().toLocaleLowerCase(), isAsc);
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
    this.apiO.GetOrder(id).valueChanges().subscribe(order => {
      
      let docDefinition = {  
        content: [
          {
            style: 'table',
            table: {
              widths: [50, 60, 55, 190, 55, 'auto'],
              heights: [50, 20, 20, 20, 20, 20, 20, 170, 20, 20, 20, 10, 10, 10, 5, 10, 50, 5, 60],
              headerRows: 1,
              body: [
                [{text: 'ORDEN DE COMPRA', colSpan: 4, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, { image: 'logo', height: 55, width: 120, colSpan: 2, alignment: 'right' }, {}],
                [{ colSpan: 4, rowSpan: 3, text: this.company.name + '\n' + this.company.business_name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' + this.company.email + ' / ' +this.company.tel }, {}, {}, {}, { text: 'MORELIA, MICHOACÁN', alignment: 'center', colSpan: 2 }, {}],
                [{}, {}, {}, {}, { text: 'OC - ' + order.id, alignment: 'center', colSpan: 2  }, {}],
                [{}, {}, {}, {}, { text: '', alignment: 'center', colSpan: 2  }, {}],
                [{ text: 'Proveedor', fillColor: '#eeeeee' }, { text: order.provider, colSpan: 3 }, {}, {}, { text: 'Fecha', fillColor: '#eeeeee',colSpan: 2 }, {}],
                [{ text: 'Atención', fillColor: '#eeeeee' }, { text: 'Demo', colSpan: 3 }, {}, {}, { text: order.orderdate, alignment: 'center', colSpan: 2 }, {}],
                /* [{ text: 'Justificación', fillColor: '#eeeeee' }, { text: order.justification, colSpan: 5 }, {}, {}, {}, {}], */
                [{ text: 'ID', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'CANTIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'UNIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'DESCRIPCIÓN', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'PRECIO UNITARIO', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'IMPORTE', bold: true, style: 'he', fillColor: '#eeeeee' }],
                [{ text: order.key, style: 'he' }, { text: order.quantity, style: 'he' }, { text: order.unit, style: 'he' }, { text: order.name, style: 'he'},  { text: this.currencyPipe.transform(order.price), style: 'he' }, { text: this.currencyPipe.transform(order.quantity*order.price) , style: 'he' }],
                [{ colSpan: 4, rowSpan: 3, text: '' }, {}, {}, {}, { text: 'Subtotal', alignment: 'right', margin: 2 }, { text: this.currencyPipe.transform(order.quantity*order.price) , style: 'he' }],
                [{}, {}, {}, {}, { text: 'I.V.A.', alignment: 'right', margin: 2 }, { text: this.currencyPipe.transform(order.quantity*order.price*order.iva) , style: 'he' }],
                [{}, {}, {}, {}, { text: 'Total MXN', alignment: 'right', margin: 2 }, { text: this.currencyPipe.transform(order.quantity*order.price*order.iva + order.quantity*order.price) , style: 'he' }],
                [{ colSpan: 6, text: 'OBSERVACIONES: ESTA ORDEN DE COMPRA SERÁ FACTURADA Y PAGADA POR ' + this.company.name, fillColor: '#eeeeee', alignment: 'center' }, {}, {}, {}, {}, {}],
                [{ colSpan: 2, text: 'Tiempo de entrega' }, {}, { text: 'Inmediato', alignment: 'center' }, { text: '', fillColor: '#eeeeee' }, { text: 'Requisición' }, { text: order.key_r, alignment: 'center' }],
                [{ colSpan: 2, text: 'Forma de pago y cuenta' }, {}, { colSpan: 4, text: '' }, {}, {}, {}],
                [{ colSpan: 6, text: '', fillColor: '#eeeeee' }, {}, {}, {}, {}, {}],
                [{ colSpan: 6, text: 'FAVOR DE ENVIAR SU FACTURA CON XML AL RECIBIR ESTA ORDEN DE COMPRA PARA PROGRAMAR SU PAGO', alignment: 'center' }, {}, {}, {}, {}, {}],
                [{ colSpan: 6, ul: [
                    'PARA PROCEDER A LA COMPRA, EL PRESENTE DOCUMENTO DEBERÁ CONTENER LAS FIRMAS DE AUTORIZACÓN.',
                    'SE RECIBIRÁ EL MATERIAL EN HORARIO DE LUNES A SÁBADO DE 7:30 A 14:30 HRS. FAVOR DE RESPETAR ESTE HORARIOY ENTREGAR A TIEMPO EL MATERIAL.',
                    'LOS DOCUMENTOS A PRESENTAR PARA RECEPCIÓN DEL MISMO SON ORIGINAL Y DOS COPIAS DEL ORDEN DE COMPRAS IMPRESA.',
                    'EN CASO DE NO TRAER LA FACTURA DEBERÁN PRESENTAR UNA REMISIÓN CON SU RESPECTIVA ORDEN DE COMPRA.',
                    'NO NOS HACEMOS RESPONSABLES EN CASO DE NO RESPETAR ESTOS HORARIOS'
                  ], fontSize: 7
                 }, {}, {}, {}, {}, {}],
                [{ colSpan: 6, text: '', fillColor: '#eeeeee' }, {}, {}, {}, {}, {}],
                [{ colSpan: 2, text: 'Director General', alignment: 'center', margin: [0, 50, 0, 0] }, {}, { colSpan: 2, text: '' }, {}, { colSpan: 2, text: 'Coordinador de Compras', alignment: 'center', margin: [0, 50, 0, 0] }, {}],
                /* ...order.orders.map(o => ([{ text: o.key, style: 'he' }, { text: o.quantity, style: 'he' }, { text: o.unit, style: 'he' }, { text: o.name, style: 'he'},  { text: this.currencyPipe.transform(o.price), style: 'he' }, { text: this.currencyPipe.transform(o.quantity*o.price) , style: 'he' }])) */
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

  openSchedulePaymentDialog(order: Order) {
    const dialogRef = this.dialog.open(SchedulePaymentComponent, {
      data: {
        order: order
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  openMakePaymentDialog(order: Order) {
    const dialogRef = this.dialog.open(MakePaymentComponent, {
      data: {
        order: order
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  openPaymentsDialog(order: Order) {
    const dialogRef = this.dialog.open(ViewPaymentComponent, {
      data: {
        order: order
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  openPDialog() {
    const dialogRef = this.dialog.open(PaidOrdersComponent, {
      /* data: {
        order: order
      }, */
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  openNewOrderDialog() {
    const dialogRef = this.dialog.open(NewOrderComponent, {
      /* data: {
        order: order
      }, */
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  debtsToPayDialog() {
    const dialogRef = this.dialog.open(DebtsToPayComponent, {
      /* data: {
        order: order
      }, */
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }
}
