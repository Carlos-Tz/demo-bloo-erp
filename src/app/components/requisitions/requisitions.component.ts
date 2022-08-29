import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Requisition } from 'src/app/models/requisition';
import { ApiRequisitionService } from 'src/app/services/api-requisition.service';
import { NewRequisitionComponent } from '../new-requisition/new-requisition.component';

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
    'situation',
    'justification',
    'action',
  ];
  //public categories: Select2Data = [];
  public requisitions: Requisition[] = [];
  //public category = '';
  constructor(
    public dialog: MatDialog,
    //public apiC: ApiCategoryService,
    public apiR: ApiRequisitionService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.apiR.GetRequisitionList().snapshotChanges().subscribe(data => {
      this.requisitions = [];
      data.forEach(item => {
        const r = item.payload.val();        
        const req = {'id': item.key, 'cicle': r.cicle, 'date': r.date, 'priority': r.priority, 'status': r.situation, 'justification': r.justification, 'petitioner': '', 'products': [] };        
        this.requisitions.push(req as Requisition);
      });
      if (this.requisitions.length > 0) {
        this.data = true;
        this.dataSource.data = this.requisitions.slice();
       /*  this.dataSource.sort = this.sort; */
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
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

  /* openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      data: {
        key: key
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
    });
  } */

  /* openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este producto?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.toastr.info('Producto eliminado!');
      }
    });
  } */

}
