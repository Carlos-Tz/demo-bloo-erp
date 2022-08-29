import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Ranch } from 'src/app/models/ranch';
import { ApiRanchService } from 'src/app/services/api-ranch.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditRanchComponent } from '../edit-ranch/edit-ranch.component';
import { NewRanchComponent } from '../new-ranch/new-ranch.component';

@Component({
  selector: 'app-ranches',
  templateUrl: './ranches.component.html',
  styleUrls: ['./ranches.component.css']
})
export class RanchesComponent implements OnInit {
  public dataSource = new MatTableDataSource<Ranch>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'status',
    'action'
  ];
  public ranches: Ranch[] = [];
  constructor(
    public dialog: MatDialog,
    public apiR: ApiRanchService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiR.GetRanchList().snapshotChanges().subscribe(data => {
      this.ranches = [];
      data.forEach(item => {
        const r = item.payload.val();        
        const ran = {'id': item.key, 'status': r.status};        
        this.ranches.push(ran as Ranch);
      });
      if (this.ranches.length > 0) {
        this.data = true;
        this.dataSource.data = this.ranches.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.ranches.slice();
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
    const dialogRef = this.dialog.open(NewRanchComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditRanchComponent, {
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
      data: "¿Confirma que desea eliminar este rancho?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiR.DeleteRanch(key);
        this.toastr.info('Rancho eliminado!');
      }
    });
  }

}
