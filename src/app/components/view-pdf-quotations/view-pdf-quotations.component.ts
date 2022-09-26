import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
import { Company } from 'src/app/models/company';
import { ApiCompanyService } from 'src/app/services/api-company.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;  

@Component({
  selector: 'app-view-pdf-quotations',
  templateUrl: './view-pdf-quotations.component.html',
  styleUrls: ['./view-pdf-quotations.component.css']
})
export class ViewPdfQuotationsComponent implements OnInit {

  public quotations = [];
  public id: number;
  public company: Company;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public apiC: ApiCompanyService,
    private currencyPipe:CurrencyPipe
  ) { }

  ngOnInit(): void {
    this.id = this.data.requisition.id;
    this.quotations =this.data.requisition.quotations;
    this.apiC.GetCompany().valueChanges().subscribe(data => {
      this.company = data;
    });
  }

  PDFQ(quotation) {
    console.log('COT-', quotation);
    
    /* this.apiR.GetRequisition(id).valueChanges().subscribe(data => {
      let priority = '';
      if(data.priority == 1){
        priority = 'Baja';
      }else if(data.priority){
        priority = 'Media';
      }else{
        priority = 'Alta';
      }
      if(!data.products){
        data.products = [{ key: '', name: '', quantity: '', unit: '' }];
      }*/
      let docDefinition = {  
        //header: 'C# Corner PDF Header',  
        content: [
          {
            style: 'table',
            table: {
              widths: [50, 60, 55, 190, 55, 'auto'],
              heights: [50, 20, 20, 20, 20, 20, 20, 25],
              headerRows: 1,
              body: [
                [{text: 'COTIZACIÓN', colSpan: 4, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, { text: '', colSpan: 2 }, {}],
                [{ colSpan: 4, rowSpan: 3, text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' }, {}, {}, {}, { text: 'MORELIA, MICHOACÁN', alignment: 'center', colSpan: 2 }, {}],
                [{}, {}, {}, {}, { text: 'COT - ' + quotation.id, alignment: 'center', colSpan: 2  }, {}],
                [{}, {}, {}, {}, { text: 'Proyecto', alignment: 'center', colSpan: 2  }, {}],
                [{ text: 'Proveedor', fillColor: '#eeeeee' }, { text: quotation.provider, colSpan: 3 }, {}, {}, { text: 'Fecha', fillColor: '#eeeeee',colSpan: 2 }, {}],
                [{ text: 'Atención', fillColor: '#eeeeee' }, { text: 'Demo', colSpan: 3 }, {}, {}, { text: quotation.date, alignment: 'center', colSpan: 2 }, {}],
                /* [{ text: 'Justificación', fillColor: '#eeeeee' }, { text: quotation.justification, colSpan: 5 }, {}, {}, {}, {}], */
                [{ text: 'ID', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'CANTIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'UNIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'DESCRIPCIÓN', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'PRECIO UNITARIO', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'IMPORTE', bold: true, style: 'he', fillColor: '#eeeeee' }],
                ...quotation.products.map(p => ([{ text: p.key, style: 'he' }, { text: p.quantity, style: 'he' }, { text: p.unit, style: 'he' }, { text: p.name, style: 'he'},  { text: this.currencyPipe.transform(p.avcost), style: 'he' }, { text: this.currencyPipe.transform(p.quantity*p.avcost) , style: 'he' }]))
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
