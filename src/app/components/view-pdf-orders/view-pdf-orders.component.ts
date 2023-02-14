import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
import { Company } from 'src/app/models/company';
import { ApiCompanyService } from 'src/app/services/api-company.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-view-pdf-orders',
  templateUrl: './view-pdf-orders.component.html',
  styleUrls: ['./view-pdf-orders.component.css']
})
export class ViewPdfOrdersComponent implements OnInit {

  public orders = [];
  public id: number;
  public company: Company;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiC: ApiCompanyService,
    private currencyPipe:CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.id = this.data.requisition.id;
    this.orders = this.data.requisition.orders;
    this.apiC.GetCompany().valueChanges().subscribe(data => {
      this.company = data;
    });
  }

  PDFO(order) {
    //console.log('OC-', order.id);
      let docDefinition = {  
        //header: 'C# Corner PDF Header',  
        content: [
          {
            style: 'table',
            table: {
              widths: [50, 60, 55, 190, 55, 'auto'],
              heights: [50, 20, 20, 20, 20, 20, 20, 170, 20, 20, 20, 10, 10, 10, 5, 10, 50, 5, 60],
              headerRows: 1,
              body: [
                [{text: 'ORDEN DE COMPRA', colSpan: 4, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, { image: this.company.logo, width: 50, colSpan: 2, alignment: 'right' }, {}],
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
        }  
      };  
     
      pdfMake.createPdf(docDefinition).open();  
    /*});*/
  } 

}
