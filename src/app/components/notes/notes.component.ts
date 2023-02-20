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
import { DeliveredNotesComponent } from '../delivered-notes/delivered-notes.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  public dataSource = new MatTableDataSource<Note>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'date',
    'customer',
    /* 'status', */
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
        if(r.status == 1){
          const not = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'status': r.status, 'justification': r.justification };        
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

  openEDialog() {
    const dialogRef = this.dialog.open(DeliveredNotesComponent, {
      width: '80%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }
  openMailDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea enviar este pedido por correo?"
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        //console.log(result);
        //this.apiC.DeleteCategory(key);
        const promise = new Promise((resolve, reject) => {
          this.apiN.GetNote(id).valueChanges().subscribe(data => {
            if(data){
              resolve(data);
            }else {
              resolve({})
            }
          });
        });
    
        await promise.then((note: any) => {
          //note['status'] = 2;
          console.log(note, note.id);
          this.apiN.UpdateNote(note, note.id);
          note['company'] = this.company;
          this.apiM.mailNote(note).subscribe({});          
        });
        this.toastr.info('Pedido enviado al correo!');
      }
    });
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
      console.log(subtotal);
      console.log(iva);
      console.log(total);
      
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
}
