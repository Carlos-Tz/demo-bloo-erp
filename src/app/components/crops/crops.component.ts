import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Crop } from 'src/app/models/crop';
import { ApiCropService } from 'src/app/services/api-crop.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditCropComponent } from '../edit-crop/edit-crop.component';
import { NewCropComponent } from '../new-crop/new-crop.component';
declare var window: any;

@Component({
  selector: 'app-crops',
  templateUrl: './crops.component.html',
  styleUrls: ['./crops.component.css']
})
export class CropsComponent implements OnInit {
  public dataSource = new MatTableDataSource<Crop>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'name',
    'description',
    'action'
  ];
  public categories: Crop[] = [];
  constructor(
    public dialog: MatDialog,
    public apiC: ApiCropService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiC.GetCropList().snapshotChanges().subscribe(data => {
      this.categories = [];
      data.forEach(item => {
        const c = item.payload.val();        
        const cat = {'id': item.key, 'name': c.name, 'description': c.description };        
        this.categories.push(cat as Crop);
      });
      if (this.categories.length > 0) {
        this.data = true;
        this.dataSource.data = this.categories.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.categories.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name.trim().toLocaleLowerCase(), b.name.trim().toLocaleLowerCase(), isAsc);
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

  openDialog() {
    const dialogRef = this.dialog.open(NewCropComponent, {
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditCropComponent, {
      data: {
        key: key
      },
      autoFocus: false,
      width: '100%',
      maxWidth: '98%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  openDeleteDialog(key: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: "¿Confirma que desea eliminar este cultivo?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiC.DeleteCrop(key);
        this.toastr.info('Cultivo eliminado!');
      }
    });
  }

}
