import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Requisition } from 'src/app/models/requisition';
import { Company } from 'src/app/models/company';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { NewRequisitionComponent } from '../new-requisition/new-requisition.component';
import pdfMake from 'pdfmake/build/pdfmake';  
import pdfFonts from 'pdfmake/build/vfs_fonts';  
pdfMake.vfs = pdfFonts.pdfMake.vfs;  
import { ApiCompanyService } from 'src/app/services/api-company.service';
import { AuthorizeRequisitionComponent } from '../authorize-requisition/authorize-requisition.component';
import { QuoteComponent } from '../quote/quote.component';
import { OrderComponent } from '../order/order.component';
import { ViewPdfQuotationsComponent } from '../view-pdf-quotations/view-pdf-quotations.component';
import { ViewPdfOrdersComponent } from '../view-pdf-orders/view-pdf-orders.component';
import { RejectedRequisitionsComponent } from '../rejected-requisitions/rejected-requisitions.component';
import { OrderedRequisitionsComponent } from '../ordered-requisitions/ordered-requisitions.component';

@Component({
  selector: 'app-requisitions',
  templateUrl: './requisitions.component.html',
  styleUrls: ['./requisitions.component.css']
})
export class RequisitionsComponent implements OnInit {
  public dataSource = new MatTableDataSource<Requisition>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'date',
    'cicle',
    'priority',
    'justification',
    'comments',
    'action',
  ];
  //public categories: Select2Data = [];
  public requisitions: Requisition[] = [];
  public company: Company;
  //public category = '';
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCompanyService,
    public apiR: ApiRequisitionService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.apiR.GetRequisitionList().snapshotChanges().subscribe(data => {
      this.requisitions = [];
      data.forEach(item => {
        const r = item.payload.val();     
        if(r.status != 5 && r.status != 3){
          const req = {'id': item.key, 'cicle': r.cicle, 'date': r.date, 'priority': r.priority, 'status': r.status, 'justification': r.justification, 'petitioner': '', 'products': [], 'quotations': r.quotations, 'orders': r.orders };        
          this.requisitions.push(req as Requisition);
        }   
      });
      if (this.requisitions.length > 0) {
        this.data = true;
        this.dataSource.data = this.requisitions.reverse().slice();
       /*  this.dataSource.sort = this.sort; */
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
    const data = this.requisitions.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date': return this.compare(a.date.trim().toLocaleLowerCase(), b.date.trim().toLocaleLowerCase(), isAsc);
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'cicle': return this.compare(a.cicle.trim().toLocaleLowerCase(), b.cicle.trim().toLocaleLowerCase(), isAsc);
        case 'priority': return this.compare(a.priority, b.priority, isAsc);
        case 'status': return this.compare(a.status, b.status, isAsc);
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

  openDialog() {
    const dialogRef = this.dialog.open(NewRequisitionComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openRDialog() {
    const dialogRef = this.dialog.open(RejectedRequisitionsComponent, {
      width: '100%',
      maxWidth: '98%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openPDialog() {
    const dialogRef = this.dialog.open(OrderedRequisitionsComponent, {
      width: '100%',
      maxWidth: '98%',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openAuthorizationDialog(id: string) {
    const dialogRef = this.dialog.open(AuthorizeRequisitionComponent, {
      data: {
        id: id
      },
      width: '100%',
      maxWidth: '98%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openRequestQuoteDialog(id: string) {
    const dialogRef = this.dialog.open(QuoteComponent, {
      data: {
        id: id
      },
      width: '100%',
      maxWidth: '98%'
    });

    //dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    //});
  }

  openOrderDialog(id: string) {
    const dialogRef = this.dialog.open(OrderComponent, {
      data: {
        id: id
      },
      width: '100%',
      maxWidth: '98%'
    });

    //dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    //});
  }

  openQuotationsDialog(requisition: Requisition) {
    const dialogRef = this.dialog.open(ViewPdfQuotationsComponent, {
      data: {
        requisition: requisition
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });

    //dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    //});
  }

  openOrdersDialog(requisition: Requisition) {
    const dialogRef = this.dialog.open(ViewPdfOrdersComponent, {
      data: {
        requisition: requisition
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
  }

  PDF(id) {
    this.apiR.GetRequisition(id).valueChanges().subscribe(data => {
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
      }
      let docDefinition = {  
        //header: 'C# Corner PDF Header',  
        content: [
          {
            style: 'table',
            table: {
              widths: [75, 75, 75, 55, 70, 'auto'],
              heights: [50, 20, 20, 20, 20, 20, 20, 15],
              headerRows: 1,
              body: [
                [{text: 'REQUISICI??N', colSpan: 5, alignment: 'center', fontSize: 26, margin: 15 },{}, {}, {}, {}, { image: 'logo', width: 50, alignment: 'right' }],
                [{ colSpan: 5, rowSpan: 3, text: this.company.name + '\n' + this.company.business_name + '\nRFC: ' + this.company.rfc + '\n' +  this.company.address +'\n' + this.company.email + ' / ' +this.company.tel }, {}, {}, {}, {}, { text: 'MORELIA, MICHOAC??N', alignment: 'center'}],
                [{}, {}, {}, {}, {}, { text: 'REQ - ' + data.id, alignment: 'center' }],
                [{}, {}, {}, {}, {}, { text: '', alignment: 'center' }],
                [{ text: 'Solicitante', fillColor: '#eeeeee' }, { text: data.petitioner, colSpan: 2 }, {}, { text: 'Ciclo', fillColor: '#eeeeee' }, { text: data.cicle }, { text: 'Fecha', fillColor: '#eeeeee' }],
                [{ text: 'Prioridad', fillColor: '#eeeeee' }, { text: priority, colSpan: 2 }, {}, { text: 'Cat??goria', fillColor: '#eeeeee' }, {}, { text: data.date, alignment: 'center'}],
                [{ text: 'Justificaci??n', fillColor: '#eeeeee' }, { text: data.justification, colSpan: 5 }, {}, {}, {}, {}],
                [{ text: 'ID', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'CANTIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'UNIDAD', bold: true, style: 'he', fillColor: '#eeeeee' }, { text: 'DESCRIPCI??N', bold: true, style: 'he', colSpan: 3, fillColor: '#eeeeee' }, {}, {}],
                ...data.products.map(p => ([{ text: p.key, style: 'he' }, { text: p.quantity, style: 'he' }, { text: p.unit, style: 'he' }, { text: p.name, colSpan: 3, style: 'he'},  '', '']))
              ]
            }
          }
        ],
        styles: {
          table :{
            fontSize: 10
          },
          he: {
            margin: 2,
            alignment: 'center'
          }
        },
        images: {
          logo: this.company.logo
        }   
      };  
     
      pdfMake.createPdf(docDefinition).open();  
    });
    //console.log(this.req);
     
    /* columns: [
            [
              { text: 'REQUISICI??N', fontSize: 26, alignment: 'center' },
              { text: 'Empresa' }, { text: 'RFC' }, { text: 'Direcci??n' }, { text: 'Colonia' }, { text: 'CP' }
            ],
            [
              { text: 'logo' , alignment: 'center'},
              { text: 'MORELIA, MICHOAC??N' , alignment: 'center'},
              { text: 'REQ - ' , alignment: 'center'},
              { text: 'Slogan' , alignment: 'center'},
              { text: 'Fecha' , alignment: 'center'},
              { text: '06/02/00' , alignment: 'center'}
            ]
          ] */
  } 
}
