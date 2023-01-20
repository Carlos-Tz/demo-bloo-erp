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
import { Application } from 'src/app/models/application';
import { ApiApplicationService } from 'src/app/services/api-application.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MailService } from 'src/app/services/mail.service';
import { Note } from 'src/app/models/note';
import { ApiNoteService } from 'src/app/services/api-note.service';

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
        //if(r.status == 1){
          const not = {'id': item.key, 'customer': r.customer.name, 'date': r.date, 'status': r.status, 'justification': r.justification };        
          this.notes.push(not as Note);
        //}   
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

  /* openMailDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea enviar esta receta por correo?"
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result){
        //console.log(result);
        //this.apiC.DeleteCategory(key);
        const promise = new Promise((resolve, reject) => {
          this.apiA.GetApplication(id).valueChanges().subscribe(data => {
            if(data){
              resolve(data);
            }else {
              resolve({})
            }
          });
        });
    
        await promise.then((app: any) => {
          app['status'] = 2;
          console.log(app, app.id);
          this.apiA.UpdateApplication(app, app.id);
          app['company'] = this.company;
          this.apiM.mailApplication(app).subscribe({});          
        });
        this.toastr.info('Receta enviada al correo!');
      }
    });
  } */

  PDF(id) {
    this.apiN.GetNote(id).valueChanges().subscribe(data => {
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
}
