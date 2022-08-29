import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Cicle } from 'src/app/models/cicle';
import { ApiCicleService } from 'src/app/services/api-cicle.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditCicleComponent } from '../edit-cicle/edit-cicle.component';
import { NewCicleComponent } from '../new-cicle/new-cicle.component';

@Component({
  selector: 'app-cicles',
  templateUrl: './cicles.component.html',
  styleUrls: ['./cicles.component.css']
})
export class CiclesComponent implements OnInit {
  public dataSource = new MatTableDataSource<Cicle>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'status',
    'action'
  ];
  public cicles: Cicle[] = [];
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCicleService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiC.GetCicleList().snapshotChanges().subscribe(data => {
      this.cicles = [];
      data.forEach(item => {
        const c = item.payload.val();        
        const cic = {'id': item.key, 'status': c.status};        
        this.cicles.push(cic as Cicle);
      });
      if (this.cicles.length > 0) {
        this.data = true;
        this.dataSource.data = this.cicles.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.cicles.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id.trim().toLocaleLowerCase(), b.id.trim().toLocaleLowerCase(), isAsc);
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
    const dialogRef = this.dialog.open(NewCicleComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditCicleComponent, {
      data: {
        key: key
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este ciclo?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiC.DeleteCicle(key);
        this.toastr.info('Ciclo eliminado!');
      }
    });
  }

}
