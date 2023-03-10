import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/models/company';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
pdfMake.vfs = pdfFonts.pdfMake.vfs;  
import { ApiCompanyService } from 'src/app/services/api-company.service';
import { MailService } from 'src/app/services/mail.service';
import { Note } from 'src/app/models/note';
import { ApiNoteService } from 'src/app/services/api-note.service';
import { OutputNoteComponent } from '../output-note/output-note.component';
import { ViewNoteComponent } from '../view-note/view-note.component';
import { DeliveredNotesComponent } from '../delivered-notes/delivered-notes.component';

@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.css']
})
export class OutputComponent implements OnInit {
  public dataSource = new MatTableDataSource<Note>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'date',
    'customer',
    'crops',
    'justification',
    'action',
  ];
  //public categories: Select2Data = [];
  public notes: Note[] = [];
  public company: Company;
  //public category = '';
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCompanyService,
    //public apiR: ApiRequisitionService,
    public apiM: MailService,
    public apiN: ApiNoteService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.apiN.GetNoteList().snapshotChanges().subscribe(data => {
      this.notes = [];
      data.forEach(item => {
        const r = item.payload.val();     
        if(r.status < 3){
          const not = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'crops': r.crops, 'justification': r.justification, 'status': r.status };        
          this.notes.push(not as Note);
        }   
      });
      if (this.notes.length > 0) {
        this.data = true;
        this.dataSource.data = this.notes.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
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
        case 'justification': return this.compare(a.justification.trim().toLocaleLowerCase(), b.justification.trim().toLocaleLowerCase(), isAsc);
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

  /* PDF(id) {
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
      //console.log(subtotal);
      //console.log(iva);
      //console.log(total);
      
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
                //[{},{ colSpan: 4, rowSpan: 3, text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' }, {}, {}, {}, { text: 'MORELIA, MICHOAC??N', alignment: 'center'}],
                [{}, { text: this.company.name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n', alignment: 'center', fontSize: 12, margin: 2, colSpan: 4 }, {}, {}, {}, { text: 'No. Pedido: ' + data.id + '\n\nFecha: '+ data.date, alignment: 'right' }],
                //[{}, {}, {}, {}, {}, { text: 'Fecha: ' + data.date, alignment: 'center' }],
                [{ text: 'Nombre', fillColor: '#eeeeee' }, { text: data.customer.name, colSpan: 5 }, {}, {}, {}, {}],
                [{ text: 'Domicilio', fillColor: '#eeeeee' }, { text: data.address, colSpan: 5 }, {}, {}, {}, {}],
                [{ text: 'Ciudad', fillColor: '#eeeeee' }, { text: data.city, colSpan: 5 }, {}, {}, {}, {}],
                [{ text: 'Justificaci??n', fillColor: '#eeeeee' }, { text: data.justification, colSpan: 5 }, {}, {}, {}, {}],
                [{ text: 'Cultivo(s)', bold: true, style: 'ce', fillColor: '#eeeeee', colSpan: 6 }, {}, {}, {}, {}, {}],
                ...data.crops.map(p => ([{ text: p, colSpan: 6 }, {}, {}, {}, {}, {}])),
                [{ text: 'Cantidad', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Unidad', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Presentaci??n', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Descripci??n', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'P.U.', bold: true, style: 'ce', fillColor: '#eeeeee' }, { text: 'Importe', bold: true, style: 'ce', fillColor: '#eeeeee' }],
                //...data.products.map(p => ([{ text: p.id + '.- ' + p.name,  colSpan: 3 }, {}, {}]))
                ...prods.map(p => ([{ text: p.quantity, style: 'ce' }, { text: p.unit, style: 'ce' }, { text: p.presentation, style: 'ce' }, { text: p.name, style: 'ce' }, { text: (p.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }, { text: (p.cost*p.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }])),
                [{ text: 'DEBO (EMOS) Y PAGAR?? (MOS) INCONDICIONALMENTE POR ESTE PAGAR?? A LA ORDEN DE Cuaut??moc Moreno Mart??nez/Milton Alejandro Rivera de Le??n EN LA CIUDAD DE __________ EL D??A _______ DE ________ DEL _______ LA CANTIDAD DE $ _______________ M.N.\n VALOR RECIBIDO A NUESTRA ENTERA SATISFACCI??N POR ESTE DOCUMENTO, LA DEMORA EN EL PAGO DE ESTE PAGAR?? CAUSA INTERESES MORATORIOS A RAZ??N DEL __ % MENSUAL.', alignment: 'left', colSpan: 4, fontSize: 8, rowSpan: 3 }, {}, {}, {}, { text: 'Subtotal', alignment: 'right' }, { text: (subtotal).toLocaleString('en-US', { style: 'currency', currency: 'USD', }), style: 'ce' }],
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
  } */

  openOutputDialog(id: string) {
    const dialogRef = this.dialog.open(OutputNoteComponent, {
      data: {
        id: id
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%',
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }

  openViewDialog(id: string) {
    const dialogRef = this.dialog.open(ViewNoteComponent, {
      data: {
        id: id
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%',
    });
    dialogRef.afterClosed().subscribe(async result => {
    });
  }

  openEDialog() {
    const dialogRef = this.dialog.open(DeliveredNotesComponent, {
      width: '100%',
      maxWidth: '98%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

}
