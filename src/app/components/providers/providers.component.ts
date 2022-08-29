import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { Select2Data, Select2UpdateEvent, Select2Value } from 'ng-select2-component';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Provider } from 'src/app/models/provider';
import { ApiCategoryService } from 'src/app/services/api-category.service';
import { ApiProviderService } from 'src/app/services/api-provider.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditProviderComponent } from '../edit-provider/edit-provider.component';
import { NewProviderComponent } from '../new-provider/new-provider.component';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css']
})
export class ProvidersComponent implements OnInit {
  public dataSource = new MatTableDataSource<Provider>();
  public data = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('input', {static: false}) input!: ElementRef;
  displayedColumns: any[] = [
    'id',
    'name',
    'phone',
    'category',
    'action'
  ];
  public providers: Provider[] = [];
  constructor(
    public dialog: MatDialog,
    public apiP: ApiProviderService,
    public toastr: ToastrService,
    ) { }

  ngOnInit(): void {
    this.apiP.GetProviderList().snapshotChanges().subscribe(data => {
      this.providers = [];
      data.forEach(item => {
        const p = item.payload.val();        
        const pro = {'id': item.key, 'name': p.name, 'phone': p.phone, 'category': p.category };        
        this.providers.push(pro as Provider);
      });
      if (this.providers.length > 0) {
        this.data = true;
        this.dataSource.data = this.providers.slice();
      }
      /* Pagination */
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 0);
    });
    
  }

  sortData(sort: Sort) {
    const data = this.providers.slice();
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
    const dialogRef = this.dialog.open(NewProviderComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(key: string) {
    const dialogRef = this.dialog.open(EditProviderComponent, {
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
      data: "¿Confirma que desea eliminar este proveedor?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        //console.log(result);
        this.apiP.DeleteProvider(key);
        this.toastr.info('Proveedor eliminado!');
      }
    });
  }

}